import { Cover } from "../../components/ui/cover";

function Page() {
  return (
    <div className="absolute top-0 w-full h-screen bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-start items-center gap-24">
      <div>
        <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
          Build connections <br />
          at<Cover>lightning speed with Nexmeet.</Cover>
        </h1>
      </div>
    </div>
  );
}

export default Page;
