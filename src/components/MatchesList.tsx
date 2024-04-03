import Match from "@/components/MatchClient";
import useMatches from '@/hooks/useMatches';
const groupsColors: Record<string, string> = {
  A: "bg-red-950/90",
  B: "bg-yellow-950/90",
  C: "bg-emerald-950/90",
  D: "bg-cyan-950/90",
  E: "bg-rose-950/90",
  F: "bg-amber-950/90",
  G: "bg-teal-950/90",
  H: "bg-violet-950/90",
};
export default function MatchesList({matchesList, isEditable = false}: {matchesList: any, isEditable: boolean}) {
  const { matches, updateMatch, deleteMatch} = useMatches(matchesList)
  return (
    <div
        className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-12"
      >
        {
          matches.map((match: any) => {
            return (
              <div key={match.match_id}>
                <Match
                  matchData={match}
                  isEditable={isEditable}
                  updateMatchFn={updateMatch}
                  deleteMatchFn={deleteMatch}
                />
                <span
                  className={`text-sm sm:text-base px-4 inline-block border border-gray-500 ${groupsColors[match.group_name]}`}
                >
                  {match.group_name}
                </span>
              </div>
            );
          })
        }
      </div>
  )
}
