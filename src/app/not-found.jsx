export default function Example() {
    return (
      <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-gray-800">
          <body class="h-full bg-gray-800">
          ```
        */}
        <main className="grid min-h-full place-items-center bg-black px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-indigo-300">404</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">Pagina no encontrada</h1>
            <p className="mt-6 text-base leading-7 text-gray-300">Al parecer no tienes acceso a esta pagina</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Ir a Inicio
              </a>
            </div>
          </div>
        </main>
      </>
    )
  }
  