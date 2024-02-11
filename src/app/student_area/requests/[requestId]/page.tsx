"use client"

import SingleRequestStudent from "@/app/components/SingleRequestStudent";

export default function SingleRequestPage({ params }: { params: { requestId: number } }){
    return <SingleRequestStudent requestId={params.requestId}/>
}
