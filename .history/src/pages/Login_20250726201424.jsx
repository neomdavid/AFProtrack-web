import logo from "../assets/AFProTrack_logo.png";
const Login = () => {
  return (
    <main className="bg-base h-screen w-screen flex justify-around items-center bg-primary">
      <section className="flex flex-col px-10 gap-2 py-8 rounded-xl bg-base-400 text-primary min-w-130">
        <div className="self-center shadow-sm mb-1 bg-primary flex items-center justify-around p-1 rounded-full">
          <img src={logo} className="h-22 w-22" />
        </div>
        <p className="mb-6 self-center text-center text-gray italic text-sm w-[80%]">
          Training Management System for Armed Forces of the Philippines
        </p>
        <p className="text-2xl font-semibold self-center">Welcome</p>
      </section>
    </main>
  );
};

export default Login;
