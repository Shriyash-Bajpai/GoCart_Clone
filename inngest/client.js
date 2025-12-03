import { Inngest } from "inngest";import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";



// Create a client to send and receive events
export const inngest = new Inngest({ id: "gocart-shriyash" });
