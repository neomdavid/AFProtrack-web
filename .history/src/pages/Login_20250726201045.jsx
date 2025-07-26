import logo from "../assets/AFProTrack_logo.png";
const Login = () => {
  return (
    <main className="bg-base h-screen w-screen flex justify-around items-center bg-primary">
      <section className="flex flex-col px-6 py-4 rounded-xl bg-base-400 text-primary min-w-130">
        <div className="self-center shadow-sm bg-primary flex items-center justify-around p-1 rounded-full">
          <img src={logo} className="h-22 w-22" />
        </div>
      </section>
    </main>
  );
};

export default Login;
