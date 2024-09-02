export default function Footer() {
  return (
    <footer className="bg-slate-800">
      <div className="max-w-5xl mx-auto min-h-60 text-gray-400 flex justify-center items-center gap-20 px-12">
        <div className="w-2/3 self-start pt-16">
          <a href="https://sergioortega.com.ar" rel="noreferrer noopener" target="_blank">
            <h3 className="text-base sm:text-lg md:text-xl">Developed by </h3>
            <h3 className="text-lg sm:text-xl md:text-3xl">Sergio Ortega dev</h3>
          </a>
        </div>

        <div className="flex flex-col w-1/3 justify-between h-full py-8 gap-4 text-sm sm:text-base md:text-lg lg:text-xl">
          <a href="https://sergioortega.com.ar/#/portfolio" rel="noreferrer noopener" target="_blank">
            <h3>See other projects of the developer: Portfolio</h3>
          </a>
          <a href="https://openweathermap.org/" rel="noreferrer noopener" target="_blank">
            <h3>This app extracts data from the Open Weather Map API</h3>
          </a>
        </div>
      </div>
    </footer>
  );
}
