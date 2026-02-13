export default function PageHeader({ title, subtitle }: {title: string, subtitle: string}) {
    return (
         <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-wider text-teal-600 dark:text-teal-400 font-medium">
            {subtitle}
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-24 bg-teal-500/70 rounded-full"></div>
          </div>
        </div>
    );
}