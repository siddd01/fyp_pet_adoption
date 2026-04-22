const PetLoader = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-700">
      <div className="absolute bottom-10 flex gap-6 animate-paw">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-4 w-4 rounded-full bg-stone-300 opacity-60"
          />
        ))}
      </div>

      <div className="relative flex items-center justify-center">
        <div className="h-12 w-20 animate-bounce rounded-full bg-stone-300 shadow-lg" />
        <div className="absolute -top-6 left-6 h-10 w-10 animate-pulse rounded-full bg-stone-200 shadow-md" />
        <div className="absolute -top-8 left-5 h-6 w-3 rotate-12 rounded-full bg-stone-400" />
        <div className="absolute -top-8 left-10 h-6 w-3 -rotate-12 rounded-full bg-stone-400" />
        <div className="absolute right-[-10px] top-2 h-2 w-4 animate-wiggle rounded-full bg-stone-400" />
      </div>

      <p className="mt-8 animate-pulse text-xl font-semibold text-stone-200">
        Finding your perfect pet...
      </p>

      <div className="mt-3 flex gap-2">
        <span className="h-3 w-3 animate-bounce rounded-full bg-stone-300" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-stone-300 [animation-delay:150ms]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-stone-300 [animation-delay:300ms]" />
      </div>
    </div>
  );
};

export default PetLoader;
