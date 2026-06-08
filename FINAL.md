# Dear candidate

Please commit this file with your name below. It is often not possible to accurately tell who the owner of a repository is. Please help us not attribute your great coding effort to a lesser candidate.

**The name on your CV is Twalani Makhubele**

## Thank you

Thank you for taking the time to complete this take-home coding assignment.

# Submission feedback

## Planning

I spent some time understanding the example streaming implementation before writing any code. My initial goal was to complete the core requirements first and avoid introducing unnecessary complexity.

The challenge was clear overall. The streaming example provided a good reference point and helped establish the expected communication pattern between the server and client.

I did not immediately know the best implementation approach for maintaining a fixed concurrency limit while streaming results progressively, so I broke the problem down into smaller pieces:

- Concurrency control
- Streaming endpoint
- Progressive frontend updates
- Error handling

The 30–45 minute time constraint felt reasonable for the core requirements, but it encouraged prioritizing a simple, reliable implementation over additional features.

## Coding

The biggest hurdle was designing the concurrency-limited loader while ensuring results could still be streamed to the client as soon as individual requests completed.

I am happy with the final solution. It satisfies the core requirements:

- Progressive NDJSON streaming
- Maximum of 5 concurrent API requests
- Incremental DOM updates
- Real-time progress updates
- Graceful handling of API failures
- Separation of concerns between routing, concurrency control, and loading logic

I used AI as a development assistant for planning, reviewing implementation approaches, discussing trade-offs, and validating the final solution against the assessment requirements. All generated suggestions were reviewed, adapted, and tested before being incorporated.

Some example prompts used:

- Review the challenge requirements and propose an implementation plan focused on streaming, concurrency control, and progressive rendering.
- Design a reusable concurrency limiter that maintains a fixed number of active requests.
- Review the solution against the assessment acceptance criteria and identify any gaps.
- Suggest lightweight CSS improvements suitable for a take-home coding assessment.

## Wrap up

If I had another hour, I would:

- Add automated tests around the concurrency limiter and streaming behaviour.
- Improve the stream message typing by sharing types between the server and client.
- Investigate the menu-loading bonus in more depth and validate the external API responses.
- Add a few more UI refinements around loading and error states.

Overall, I focused on delivering a clean, working implementation of the core requirements and ensuring the solution remained easy to understand and maintain.

## Notes

The UI intentionally remains lightweight and framework-free. Basic CSS was used to improve readability and make progressive updates visually clear without introducing additional dependencies or complexity. The primary focus of the solution was concurrency control, progressive streaming, incremental rendering, and reliability.