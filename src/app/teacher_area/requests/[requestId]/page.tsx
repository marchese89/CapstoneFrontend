"use client"

import SingleRequestTeacher from "@/app/components/SingleRequestTeacher";

export default function SingleRequestPage({ params }: { params: { requestId: number } }){
    return <SingleRequestTeacher requestId={params.requestId}/>
}
