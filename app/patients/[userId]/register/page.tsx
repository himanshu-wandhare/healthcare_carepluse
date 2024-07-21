import Image from "next/image";
import RegisterForm from "@/components/forms/RegisterForm";

import { getUser } from "@/lib/actions/patient.actions";

export default async function RegisterPage({
  params: { userId },
}: SearchParamProps) {
  const user = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            className="mb-12 h-10 w-fit"
            alt="carepulse"
          />
          <RegisterForm user={user} />
          <p className="copyright py-12">©️ 2024 CarePulse</p>
        </div>
      </section>
      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
}
