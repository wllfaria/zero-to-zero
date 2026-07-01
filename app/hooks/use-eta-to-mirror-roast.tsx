export type UseEtaToMirrorResult = {
  value: string;
  subtitle: string;
  roast: string;
};

export type UseEtaToMirrorInput = {
  daysToMirror: number;
  divPerHourShortfall: number;
  divPerHourToWin: number;
  mirrorDailyInflation: number;
};

export type UseEtaToMirror = (
  input: UseEtaToMirrorInput,
) => UseEtaToMirrorResult;

const getValue = (daysToMirror: number) => {
  return daysToMirror === Infinity ? "cooked" : `~${daysToMirror} days`;
};

const getSubtitle = ({
  daysToMirror,
  divPerHourShortfall,
  divPerHourToWin,
  mirrorDailyInflation,
}: UseEtaToMirrorInput) => {
  if (daysToMirror >= Infinity) {
    const shortfall = divPerHourShortfall.toFixed(1);
    const rationToWin = divPerHourToWin.toFixed(1);
    return `needs +${shortfall}d/h to stop bleeding, ${rationToWin}d/h to win in 30d`;
  }

  return `mirror inflating +${mirrorDailyInflation.toFixed(0)}d/day`;
};

const getRoast = (daysToMirror: number) => {
  if (daysToMirror >= Infinity) return "maybe we should give up";
  else if (daysToMirror >= 50) return "almost there copium";
  else if (daysToMirror >= 20) return "guys trust we're getting close";
  else return "HOLY we may actually get a mirror";
};

export const useEtaToMirrorRoast: UseEtaToMirror = (input) => {
  return {
    value: getValue(input.daysToMirror),
    subtitle: getSubtitle(input),
    roast: getRoast(input.daysToMirror),
  };
};
