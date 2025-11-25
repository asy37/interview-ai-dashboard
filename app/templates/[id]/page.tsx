'use client'
import { useParams } from "next/navigation"

export default function TemplateDetailPage(){
    const params = useParams()
    const id = params.id

    return <div>
        id: {id}
    </div>
}