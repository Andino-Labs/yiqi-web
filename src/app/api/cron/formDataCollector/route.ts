// we check for forms and create a new agent to handle that form.
// the agent asks certain things in a conversational manner. large forms are handlded gracefully.
// agent must have enough context to handle form plus any superset of data it might need.
// maybe even checks user posts in twitter and linkedin to get more context for convincing.

import { NextResponse } from 'next/server'

export async function POST() {
  NextResponse.json({ message: 'not yet implemented' })
}
