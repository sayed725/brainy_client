export default function DashboardPagesHeader({ title , subtitle, icon: Icon }: {title: string, subtitle: string, icon: any} ) {
    return (
       <div className="mb-4 ">
      <div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-700 dark:text-white flex items-center gap-3">
          {Icon && <Icon className="text-3xl text-gray-700 dark:text-white" />}
          {title}
        </h2>
        <p className="text-gray-700 text-base md:text-lg lg:text-xl mt-1 ml-0.5 dark:text-white font-medium lg:whitespace-pre-line">
          {subtitle}
        </p>
      </div>
    </div>
    );
}