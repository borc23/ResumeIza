export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-primary-800/50 rounded ${className}`}></div>
  );
}

export function ProjectSkeleton() {
  return (
    <div className="bg-white dark:bg-primary-800/50 rounded-xl overflow-hidden shadow-lg border border-primary-100 dark:border-primary-700">
      <div className="h-48 bg-gray-200 dark:bg-primary-700 animate-pulse"></div>
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

export function ExperienceSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-8 relative">
       {/* Dot */}
       <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-200 dark:bg-primary-700 rounded-full border-4 border-white dark:border-primary-900 z-10"></div>
       
       <div className="w-full md:w-1/2 md:pr-12 md:text-right">
        <div className="bg-white dark:bg-primary-800/50 rounded-xl p-6 shadow-lg border border-primary-100 dark:border-primary-700 space-y-4">
          <Skeleton className="h-6 w-32 mb-2 inline-block" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
       </div>
    </div>
  );
}

export function SkillsSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
       {[1, 2, 3, 4].map((i) => (
         <div key={i} className="bg-white dark:bg-primary-800/50 rounded-xl p-6 shadow-lg border border-primary-100 dark:border-primary-700 space-y-4">
           <Skeleton className="h-6 w-1/3 mb-4" />
           <div className="space-y-4">
             {[1, 2, 3, 4].map((j) => (
               <div key={j} className="space-y-2">
                 <div className="flex justify-between">
                   <Skeleton className="h-4 w-1/3" />
                   <Skeleton className="h-4 w-16" />
                 </div>
                 <Skeleton className="h-2 w-full rounded-full" />
               </div>
             ))}
           </div>
         </div>
       ))}
    </div>
  );
}

export function EducationSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
       {[1, 2].map((i) => (
         <div key={i} className="bg-white dark:bg-primary-800/50 rounded-xl p-6 shadow-lg border-l-4 border-gray-300 dark:border-accent-500/50 flex items-start gap-4">
            <Skeleton className="w-14 h-14 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
         </div>
       ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 animate-pulse">
       <div className="w-48 h-48 md:w-64 md:h-64 bg-gray-200 dark:bg-primary-800 rounded-full flex-shrink-0"></div>
       <div className="w-full text-center md:text-left space-y-4">
         <Skeleton className="h-10 w-3/4 mx-auto md:mx-0" />
         <Skeleton className="h-6 w-1/2 mx-auto md:mx-0" />
         <Skeleton className="h-24 w-full" />
         <div className="flex justify-center md:justify-start gap-4">
           <Skeleton className="h-6 w-32" />
           <Skeleton className="h-6 w-32" />
         </div>
         <div className="flex justify-center md:justify-start gap-4 pt-4">
           <Skeleton className="h-12 w-32 rounded-lg" />
           <Skeleton className="h-12 w-32 rounded-lg" />
         </div>
       </div>
    </div>
  );
}

