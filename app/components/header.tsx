import Image from "next/image";

export const Header = () => {
  return (
    <header className="w-full max-w-5xl mx-auto pt-16 pb-4 flex items-center gap-6">
      <Image
        src="https://cdn.7tv.app/emote/01KWAE1BDXHM5Y2ZMCF32GXVEF/4x.avif"
        alt="farmer emote"
        className="w-20 shrink-0"
        width="200"
        height="200"
      />
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
          the challenge
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
          farmer{" "}
          <span className="text-gray-400 dark:text-gray-500 font-normal">
            zero to
          </span>{" "}
          <span className="relative inline-block">
            <span className="line-through text-gray-300 dark:text-gray-700">
              zero
            </span>
          </span>{" "}
          <Image
            src="/mirror-of-kalandra.png"
            alt="Mirror of Kalandra"
            width={48}
            height={48}
            className="inline-block align-middle"
          />
        </h1>
      </div>
    </header>
  );
};
