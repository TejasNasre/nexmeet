function Page() {
  return (
    <div className="w-full h-screen bg-black text-white py-[8rem] px-4 flex flex-col justify-start items-center gap-24">
      <h1 className="text-center text-4xl font-bold bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r  from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">Contact Us</h1>

      <form action="/" method="POST" className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-gray-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-gray-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block mb-2 text-sm font-medium">Message:</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            required
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-gray-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Page;
