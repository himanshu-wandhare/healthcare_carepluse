"use server";

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";
import { ID, Query } from "node-appwrite";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { formatDateTime, parseStringify } from "../utils";

export async function createAppointment(appointment: CreateAppointmentParams) {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating appointment: ", error);
  }
}

export async function getAppointment(appoinmtentId: string) {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appoinmtentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.error("An error occurred while retrieving appointment: ", error);
  }
}

export async function getRecentAppointmentList() {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const iniitalCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === "scheduled") {
          acc.scheduledCount += 1;
        } else if (appointment.status === "pending") {
          acc.pendingCount += 1;
        } else if (appointment.status === "cancelled") {
          acc.cancelledCount += 1;
        }

        return acc;
      },
      iniitalCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    revalidatePath("/admin");
    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retreiving appointment list: ",
      error
    );
  }
}

export async function updateAppointment({
  type,
  appointment,
  appointmentId,
  userId,
}: UpdateAppointmentParams) {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) throw Error;

    const message = {
      schedule: `Your appointment is confirmed for ${
        formatDateTime(appointment.schedule).dateTime
      } with Dr. ${appointment.primaryPhysician}`,
      cancel: `We regret to inform that your appointment for ${
        formatDateTime(appointment.schedule).dateTime
      } is cancelled. Reason: ${appointment.cancellationReason}.`,
    };

    await sendSMSNotification(userId, message[type]);
    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occured while updating an appointment: ", error);
  }
}

async function sendSMSNotification(userId: string, content: string) {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );

    return parseStringify(message);
  } catch (error) {
    console.log("An error occurred while sending SMS: ", error);
  }
}
