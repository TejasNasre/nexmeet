'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Event {
  id: string
  event_title: string
  event_description: string
  event_location: string
  event_registration_startdate: string
  event_registration_enddate: string
  event_startdate: string
  event_enddate: string
  event_duration: string
  team_size: string
  event_formlink: string
  event_price: string
  organizer_name: string
  organizer_email: string
  organizer_contact: string
  event_category: string
  event_tags: string[]
  event_social_links: string[]
}

export default function UpdateEvent() {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId')

  useEffect(() => {
    if (eventId) {
      fetchEventDetails(eventId)
    }
  }, [eventId])

  const fetchEventDetails = async (eventId: string) => {
    setLoading(true)
    const { data, error } = await supabase
      .from("event_details")
      .select("*")
      .eq("id", eventId)
      .single()

    if (error) {
      console.error("Error fetching event details:", error)
    } else {
      setEvent({
        ...data,
        event_tags: typeof data.event_tags === 'string' ? data.event_tags.split(",") : [],
        event_social_links: typeof data.event_social_links === 'string' ? data.event_social_links.split(",") : []
      })
    }
    setLoading(false)
  }

  const handleUpdateEvent = async () => {
    if (!event) return

    // Validation
    if (!event.event_title || !event.event_description || !event.event_location || !event.event_registration_startdate || !event.event_registration_enddate || !event.event_startdate || !event.event_enddate || !event.event_duration || !event.team_size || !event.event_formlink || !event.event_price || !event.organizer_name || !event.organizer_email || !event.organizer_contact || !event.event_category) {
      setErrorMessage("Please fill out all required fields.")
      return
    }

    const updatedEvent = {
      ...event,
      event_tags: event.event_tags.length > 0 ? event.event_tags : [],
      event_social_links: event.event_social_links.length > 0 ? event.event_social_links : []
    }

    const { error } = await supabase
      .from("event_details")
      .update(updatedEvent)
      .eq("id", event.id)

    if (error) {
      console.error("Error updating event:", error)
    } else {
      setSuccessMessage("Event updated successfully.")
      setTimeout(() => {
        setSuccessMessage(null)
        router.push('/edit-event')
      }, 3000)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="absolute top-0 w-full h-auto bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-center items-center">
      <form
        onSubmit={handleUpdateEvent}
        className="w-full flex flex-col flex-wrap gap-10 md:w-2/3"
      >
        <h1 className="text-2xl md:text-4xl font-extrabold text-center">
          Update Event
        </h1>
        {successMessage && (
          <div className="mb-4 p-4 bg-green-500 text-white rounded">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-500 text-white rounded">
            {errorMessage}
          </div>
        )}
        {event && (
          <>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="event_title">Event Title: </label>
              <input
                required
                type="text"
                placeholder="Enter Event Title"
                value={event.event_title}
                onChange={(e) => setEvent({ ...event, event_title: e.target.value })}
                className="w-full border border-white p-2 rounded-md bg-black text-white"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="event_description">Event Description: </label>
              <textarea
                required
                placeholder="Enter Event Description"
                rows={4}
                cols={50}
                value={event.event_description}
                onChange={(e) => setEvent({ ...event, event_description: e.target.value })}
                className="w-full border border-white p-2 rounded-md bg-black text-white"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="event_location">Event Location: </label>
              <input
                required
                type="text"
                placeholder="Enter Event Location"
                value={event.event_location}
                onChange={(e) => setEvent({ ...event, event_location: e.target.value })}
                className="w-full border border-white p-2 rounded-md bg-black text-white"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="event_registration_startdate">Event Registration Start Date:{" "}
              </label>
              <input
                required
                type="datetime-local"
                placeholder="event_registration_startdate"
                value={event.event_registration_startdate}
                onChange={(e) => setEvent({ ...event, event_registration_startdate: e.target.value })}
                className="w-full border border-white p-2 rounded-md bg-black text-white"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="event_registration_enddate">Event Registration End Date:{" "}
              </label>
              <input
                required
                type="datetime-local"
                placeholder="event_registration_enddate"
                value={event.event_registration_enddate}
                onChange={(e) => setEvent({ ...event, event_registration_enddate: e.target.value })}
                className="w-full border border-white p-2 rounded-md bg-black text-white"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="event_startdate">Event Start Date: </label>
              <input
                required
                type="datetime-local"
                placeholder="event_startdate"
                value={event.event_startdate}
                onChange={(e) => setEvent({ ...event, event_startdate: e.target.value })}
                className="w-full border border-white p-2 rounded-md bg-black text-white"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="event_enddate">Event End Date: </label>
              <input
                required
                type="datetime-local"
                placeholder="event_enddate"
                value={event.event_enddate}
                onChange={(e) => setEvent({ ...event, event_enddate: e.target.value })}
                className="w-full border border-white p-2 rounded-md bg-black text-white"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="event_duration">Event Duration(In hours): </label>
              <input
                required
                type="number"
                placeholder="Enter Event Duration (In hours)"
                value={event.event_duration}
                onChange={(e) => setEvent({ ...event, event_duration: e.target.value })}
                className="w-full border border-white p-2 rounded-md bg-black text-white"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="team_size">Event Team Size: </label>
              <input
                required
                type="number"
                placeholder="Enter Team Size"
                value={event.team_size}
                onChange={(e) => setEvent({ ...event, team_size: e.target.value })}
                className="w-full border border-white p-2 rounded-md bg-black text-white"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="event_formlink">Event Form Link: </label>
              <input
                required
                type="url"
                placeholder="Enter Google Form Link / Website Link"
                value={event.event_formlink}
                onChange={(e) => setEvent({ ...event, event_formlink: e.target.value })}
                className="w-full border border-white p-2 rounded-md bg-black text-white"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="event_price">Event Price: </label>
              <input
                required
                type="number"
                placeholder="Enter Event Price (INR)"
                value={event.event_price}
                onChange={(e) => setEvent({ ...event, event_price: e.target.value })}
                className="w-full border border-white p-2 rounded-md bg-black text-white"
              />
              <p>If Free Enter 0</p>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="organizer_name">Event Organizer / Organization Name:{" "}</label>
              <input
                required
                type="text"
                placeholder="Enter Organizer / Organization Name"
                value={event.organizer_name}
                onChange={(e) => setEvent({ ...event, organizer_name: e.target.value })}
                className="w-full border border-white p-2 rounded-md bg-black text-white"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="organizer_contact"> Event Organizer / Organization Contact:{" "}</label>
              <input
                type="tel"
                placeholder="Enter Organizer / Organization Contact"
                value={event.organizer_contact}
                onChange={(e) => setEvent({ ...event, organizer_contact: e.target.value })}
                className="w-full border border-white p-2 rounded-md bg-black text-white"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="event_category">Event Category: </label>
              <select
                required
                value={event.event_category}
                onChange={(e) => setEvent({ ...event, event_category: e.target.value })}
                className="w-full border border-white p-2 rounded-md bg-black text-white"
              >
              <option value="technical">technical</option>
              <option value="sports">sports</option>
              <option value="cultural">cultural</option>
              <option value="meetup">meetup</option>
              <option value="conference">conference</option>
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="event_tags">Event Tags: </label>
              <input
                required
                type="text"
                placeholder="Enter Event Tags (Comma Separated)"
                value={event.event_tags.join(",")}
                onChange={(e) => setEvent({ ...event, event_tags: e.target.value.split(",") })}
                className="w-full border border-white p-2 rounded-md bg-black text-white"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="event_social_links">Event Social Links: </label>
              <input
                required
                type="text"
                placeholder="Enter Event Social Links (Comma Separated)"
                value={event.event_social_links.join(",")}
                onChange={(e) => setEvent({ ...event, event_social_links: e.target.value.split(",") })}
                className="w-full border border-white p-2 rounded-md bg-black text-white"
              />
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="bg-blue-500 text-white p-2 rounded-md">Update Event</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will update the event details.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleUpdateEvent}>Update</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </form>
    </div>
  )
}