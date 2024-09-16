export default function Loading() {
  return (
    <div className="absolute top-0 w-full h-screen bg-black text-white flex flex-col justify-center items-center">
      <span className="loading loading-spinner loading-lg text-white"></span>
    </div>
  );
}
