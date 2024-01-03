'use client';
import ResultsView from "@/app/ResultsView"


export default function Results({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col items-center">
      <ResultsView task_id={params.id} />
    </div>
  )
}
