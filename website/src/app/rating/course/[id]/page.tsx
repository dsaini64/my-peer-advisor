"use client"

import React from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useState, useEffect, useContext, createContext } from 'react'
import { RateProfessor, ReviewBox, SelectClass, SelectProfessorTags } from '../../rateComponents';
import { on } from 'events';


export default function CourseRatingPage({ params }: { params: { id: string } }) {


    const [data, setData] = useState<null | any>(null)
    const [isLoading, setLoading] = useState(true)
    const [tags, setTags] = useState<null | any>(null)
    const [professorIdentifier, setCourseIdentifier] = useState<null | any>(null)
    const [courseRating, setProfessorRating] = useState<null | any>(null)
    const [courseReview, setProfessorReview] = useState<null | any>(null)

}