import MatchDialog from "@/components/MatchDialog";

// const {
//   matchId,
//   duo1Id,
//   duo2Id,
//   phaseId,
//   player1Duo1,
//   player2Duo1,
//   player1Duo2,
//   player2Duo2,
//   pointsDuo1,
//   pointsDuo2,
//   isEditable = false,
// } = Astro.props;

export default function Match({matchData, isEditable, updateMatchFn, deleteMatchFn} : {matchData: any, isEditable: boolean, updateMatchFn: Function, deleteMatchFn: Function}) {
  const {
    match_id: matchId, duo1_id: duo1Id, duo2_id: duo2Id, phase_id: phaseId,
    points_d1: pointsDuo1, points_d2: pointsDuo2,
    player1_duo1: player1Duo1, player2_duo1: player2Duo1,
    player1_duo2: player1Duo2, player2_duo1: player2Duo2} = matchData;

  return (
    <article
      className="relative w-full flex flex-col items-center bg-gradient-to-b from-black bg-stone-800 border rounded-sm"
    >
      {
        isEditable && (
          <MatchDialog
            matchId={matchId}
            duo1Id={duo1Id}
            duo2Id={duo2Id}
            phaseId={phaseId}
            pointsDuo1={pointsDuo1}
            pointsDuo2={pointsDuo2}
            updateMatchFn={updateMatchFn}
            deleteMatchFn={deleteMatchFn}
          />
        )
      }
      <div
        className="absolute inset-0 h-full w-full bg-[radial-gradient(#ffffff35_1px,transparent_1px)] [background-size:14px_14px]"
      >
      </div>
      {/* <!-- Duos --> */}
      <div
        className="h-full items-center py-3 px-4 grid grid-cols-[1fr_auto] gap-x-5 border w-full"
      >
        <div className="flex items-center">
          <p className="text-sm lg:text-base">{player1Duo1}</p>
          <span className="mx-1">/</span>
          <p className="text-sm lg:text-base">{player2Duo1}</p>
        </div>
        <span className="inline-block text-lg ml-2 justify-self-end">{pointsDuo1}</span>
      </div>
      <span
        className="absolute top-1/2 -translate-y-1/2 z-10 backdrop-blur-sm font-audioWide text-md sm:text-lg -skew-y-3 inline-block"
      >
        VS
      </span>
      <div
        className="h-full items-center py-3 px-4 grid grid-cols-[1fr_auto] gap-x-5 border w-full"
      >
        <div className="flex items-center">
          <p className="text-sm lg:text-base">{player1Duo2}</p>
          <span className="mx-1">/</span>
          <p className="text-sm lg:text-base">{player2Duo2}</p>
        </div>
        <span className="inline-block text-lg ml-2 justify-self-end">{pointsDuo2}</span>
      </div>
    </article>

  )
}
