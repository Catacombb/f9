# Design Brief Form - Questions for AI Agent Training

This document outlines all the questions asked in the F9 Productions Design Brief Tool. It can be used to train an AI agent to assist users with filling out the form or answer questions about the brief.

## Section 1: Project Information

This section gathers basic details about the client and the project.

*   **Client Name:** What is the primary contact name for this project?
*   **Project Address:** What is the full street address of the project site? (This will also be used to fetch coordinates for site analysis if possible)
*   **Contact Email:** What is the best email address to reach the client?
*   **Contact Phone:** What is the best phone number for the client?
*   **Project Type:** What type of project is this? (e.g., New Build, Renovation, Addition, Interior Design)
*   **Project Description:** Please provide a brief overview of the project. What are you looking to achieve?
*   **Move-in Preference / Timeline:** What is your ideal timeframe or preferred move-in date for this project?
*   **Project Goals:** What are the main goals for this project? What are the must-haves?
*   **Desired Move-in Date:** Do you have a specific target date for moving in or project completion? (Optional, can be more specific than the general timeline)
*   **Project Coordinates:** (Usually auto-filled from address) Latitude and Longitude of the project site.

## Section 2: Budget

This section focuses on the financial aspects of the project.

*   **Budget Range:** What is your estimated budget range for this project? (Provide predefined ranges or an option for "To be determined")
*   **Budget Flexibility Notes:** How flexible is your budget? Are there areas where you're willing to invest more or less?
*   **Priority Areas for Investment:** Which areas of the project are the highest priority for your budget? (e.g., Kitchen, Master Suite, Outdoor Living)
*   **Project Timeframe (related to budget):** How does your desired project timeframe align with your budget expectations?
*   **Budget Flexibility (Specific):** Is your budget firm, slightly flexible, or very flexible?
*   **Budget Priorities (List):** Can you list specific items or areas that are top priorities for your budget?
*   **Budget Notes:** Are there any other notes or considerations regarding the budget you'd like to share?

## Section 3: Lifestyle

This section aims to understand the client's living habits and preferences.

*   **Occupants (General Description):** Who will be living in the home? (e.g., Number of adults, children, ages)
*   **Occupation Details:** What are the occupations of the primary adults in the household? Does anyone work from home?
*   **Daily Routine:** Describe a typical day in your household. What are your daily patterns and activities?
*   **Entertainment Style:** How do you typically entertain guests? (e.g., Formal dinners, casual get-togethers, large parties)
*   **Special Requirements/Needs:** Are there any special accessibility needs, health considerations, or specific requirements for any occupants?
*   **Pets:** Do you have any pets? If so, what kind and how many? (This may lead to questions about pet-specific needs like feeding stations, pet doors, etc.)
*   **Hobbies and Interests:** What are your hobbies and interests that might require dedicated space or storage? (e.g., Reading nook, home gym, art studio)
*   **Entertaining Frequency/Style (Specific):** How often do you entertain and for how many guests typically?
*   **Work From Home Details:** If anyone works from home, what are the specific needs for the home office space? (e.g., Quiet, natural light, separate entrance)
*   **Lifestyle Notes:** Any additional information about your lifestyle, family dynamics, or how you envision using your home?
*   **Desired Home Feeling/Ambiance:** How do you want your home to feel? (e.g., Cozy, modern, minimalist, vibrant, tranquil)
*   **Occupant Entries (Detailed):**
    *   For each occupant:
        *   **Type:** (e.g., Adult, Child, Dog, Cat, Other)
        *   **Name:** Name of the occupant.
        *   **Notes:** Any specific notes or needs related to this occupant (e.g., allergies, specific room requirements for a child).

## Section 4: Site Information

This section gathers details about the project site.

*   **Existing Conditions:** Describe the current state of the site. Is it vacant land, or is there an existing structure?
*   **Site Features:** What are the notable features of the site? (e.g., Slopes, views, mature trees, water bodies, sun exposure - this can be a list or free text)
*   **Views and Orientations:** What are the best views from the site? Which direction does the site face? Are there any undesirable views to mitigate?
*   **Access and Constraints:** How is the site accessed? Are there any physical constraints or challenges? (e.g., Narrow driveway, steep access, easements)
*   **Neighboring Properties:** Describe the surrounding properties. What is the neighborhood like? (e.g., Proximity, style of adjacent homes, privacy concerns)
*   **Site Features and Views (Combined):** A summary or detailed description of key site features and important views to consider in the design.
*   **Topographic Survey Available?** Do you have a topographic survey of the site? (Yes/No, option to upload)
*   **Existing House Drawings Available?** If there's an existing structure, do you have drawings? (Yes/No, option to upload)
*   **Septic Design Available/Needed?** Is there an existing septic system, or will a new one be required? Do you have a septic design? (Yes/No, option to upload)
*   **Certificate of Title Available?** Do you have the Certificate of Title for the property? (Yes/No, option to upload)
*   **Covenants or Restrictions?** Are there any covenants, easements, or building restrictions on the property? (Yes/No, option to describe or upload)
*   **Site Constraints (List):** List any specific constraints affecting the site (e.g., Setbacks, height restrictions, protected trees).
*   **Site Access Details:** Further details on site accessibility for construction and daily use.
*   **Site Views Details:** More specific information on preferred views and views to avoid.
*   **Outdoor Spaces Desired (List):** What types of outdoor spaces are you hoping for? (e.g., Deck, patio, garden, pool, outdoor kitchen)
*   **Site Notes:** Any other relevant information about the site.

## Section 5: Spaces

This section details the specific rooms and spaces required in the home.

*   **Rooms (List of Rooms):** For each room or space:
    *   **Room ID:** (Auto-generated)
    *   **Type:** Standard room type (e.g., Kitchen, Bedroom, Bathroom, Living Room, Office) or specify "Custom".
    *   **Quantity:** (Usually 1 for named rooms, but can be >1 for generic like 'Guest Bedroom')
    *   **Description/Notes:** Detailed requirements for this room. (This is often a JSON string with specific sub-questions depending on the room type, e.g., for a Kitchen: 'Island seating?', 'Appliance preferences?', 'Pantry size?'. For a Bedroom: 'King size bed?', 'Walk-in closet?').
    *   **Is Custom Name?** (Boolean) If the room type is "Custom".
    *   **Custom Name:** If "Custom", the specific name for this space (e.g., "Meditation Room").
    *   **Display Name:** A user-friendly name for the room, especially if quantity > 1 (e.g., "Master Bedroom", "Kid's Bedroom 1").
    *   **Primary Users:** Who will primarily use this room? (Links to Occupant Entries)
    *   **Level/Floor:** Which level of the home should this room be on? (e.g., Ground Floor, Upper Floor, Basement)
*   **Additional Notes on Spaces:** General notes about the spaces, their relationships, or overall spatial requirements not covered per room.
*   **Room Types (General List):** A quick checklist of standard room types desired.
*   **Specialty Spaces (List):** Any unique or specialty spaces required? (e.g., Wine cellar, home theater, safe room)
*   **Storage Needs:** Describe your general and specific storage requirements throughout the home.
*   **Spatial Relationships/Flow:** How do you envision the different spaces connecting and flowing into each other?
*   **Accessibility Needs (Spaces):** Any specific accessibility requirements for the layout or individual spaces?
*   **Spaces Notes (Overall):** Any further notes on the overall space plan.
*   **Home Level Preference:** Do you prefer a single-level or multi-level home?
*   **Level Assignment Notes:** Specific notes on how rooms/functions should be distributed across levels if multi-level.
*   **Desired Home Size:** What is the approximate desired square footage or overall size of the home?
*   **Eliminable Spaces:** If the budget or site is constrained, are there any spaces you would consider eliminating or reducing?
*   **Room Arrangement Preferences:** Any specific preferences for how rooms are grouped or arranged? (e.g., Master suite separate from other bedrooms)

## Section 6: Architecture & Style

This section explores the client's aesthetic preferences for the building's architecture and interior design.

*   **Style Preferences (Overall):** Describe your preferred architectural style(s). (e.g., Modern, contemporary, traditional, farmhouse, craftsman. Users can provide examples or upload inspiration).
*   **External Materials:** What types of exterior materials do you like or dislike? (e.g., Wood siding, stone, stucco, brick, metal roofing)
*   **Internal Finishes:** What are your preferences for interior finishes? (e.g., Hardwood floors, tile, carpet, paint colors, trim style)
*   **Sustainability Goals:** Are there any specific sustainability features or goals for the project? (e.g., Solar panels, rainwater harvesting, passive heating/cooling, use of recycled materials)
*   **Special Architectural Features:** Are there any unique architectural features you'd like to incorporate? (e.g., Double-height living room, large feature windows, exposed beams, unique rooflines)
*   **Inspiration Notes:** General notes about your design inspirations.
*   **Preferred Styles (List):** Select from a list of common architectural styles.
*   **Material Preferences (List):** Select from lists of common exterior and interior materials.
*   **Sustainability Features (List):** Select from a list of common sustainability features.
*   **Technology Requirements (List):** Any smart home technology or specific tech integrations desired? (e.g., Automated lighting, security systems, whole-house audio)
*   **Architecture Notes (Overall):** Any further notes on architectural design or style.
*   **Selected External Materials (Specific List):** Confirmed list of desired external materials.
*   **Selected Internal Materials (Specific List):** Confirmed list of desired internal materials.
*   **Inspiration Links:** Provide links to websites, Pinterest boards, Houzz ideabooks, etc.
*   **Inspiration Comments:** Comments or descriptions for each inspiration link or image.
*   **Inspiration Entries (Detailed):** For each inspiration item:
    *   **Link:** URL to the inspiration.
    *   **Description:** Notes about what you like about this inspiration.

## Section 7: Contractors & Team

This section discusses preferences for the construction team.

*   **Preferred Builder:** Do you have a preferred builder you'd like to work with? If so, please provide their details.
*   **Intention to Go To Tender:** Do you intend to get bids from multiple builders (go to tender)? (Yes/No)
*   **Interest in F9 Build:** Would you like F9 Productions to handle the construction (design-build)? (Yes/No)
*   **(If applicable) F9 Build Confirmation:** Confirming interest in F9's build services.
*   **Structural Engineer:** Do you have a preferred structural engineer, or will one need to be engaged?
*   **Civil Engineer:** Do you have a preferred civil engineer, or will one need to be engaged?
*   **Other Consultants:** Are there any other consultants you plan to involve or require? (e.g., Landscape architect, interior designer not part of F9, lighting designer)
*   **Professionals (List):** For each professional/consultant:
    *   **ID:** (Auto-generated)
    *   **Type:** (e.g., Architect, Interior Designer, Builder, Structural Engineer, Landscape Architect)
    *   **Name:** Name of the professional or company.
    *   **Business Name:** (If different from Name)
    *   **Email:** Contact email.
    *   **Phone:** Contact phone.
    *   **Website:** Website URL.
    *   **Contact Person:** (If a company)
    *   **Notes:** Any relevant notes.
    *   **Is Custom?** (Boolean)
*   **Additional Notes on Contractors/Team:** Any other preferences or information regarding the project team.

## Section 8: Communication

This section outlines communication preferences for the project.

*   **Preferred Communication Methods (List):** How do you prefer to be contacted? (e.g., Email, Phone, Video Call, In-person meetings)
*   **Best Times to Contact (List):** What are the best times of day or days of the week to reach you?
*   **Available Days for Meetings (List):** Which days are you typically available for meetings?
*   **Desired Frequency of Updates:** How often would you like to receive project updates? (e.g., Daily, weekly, bi-weekly, as needed)
*   **Urgent Contact Method:** What is the best way to reach you for urgent matters?
*   **Expected Response Time:** What is your typical response time to communications?
*   **Additional Communication Notes:** Any other communication preferences or requirements.
*   **Communication Notes (Overall):** Further general notes on communication.

## Section 9: File Uploads

This section is where users can upload relevant documents. While not direct questions, the types of files requested imply questions:

*   **Site Documents:** Please upload any relevant site documents (e.g., Survey, Geotechnical report, Existing plans).
*   **Inspiration Images/Files:** Please upload any inspiration images or files you have saved.
*   **Supporting Documents:** Please upload any other supporting documents relevant to your project.
*   **Site Photos:** Please upload photos of the existing site.
*   **Design Files (if any):** If you have any existing design files or sketches, please upload them.

## Section 10: Feedback (If applicable, for the tool itself)

This section is typically about feedback on the design brief tool itself, not the project.

*   **Usability Rating:** How would you rate the usability of this tool? (Scale)
*   **Performance Rating:** How would you rate the performance of this tool? (Scale)
*   **Functionality Rating:** How would you rate the functionality provided by this tool? (Scale)
*   **Design Rating:** How would you rate the design and appearance of this tool? (Scale)
*   **What do you like most?** What features or aspects of this tool did you find most helpful?
*   **What could be improved?** What suggestions do you have for improving this tool?
*   **What feature would you like to see next?** Are there any features you wish this tool had?
*   **Additional Feedback:** Any other comments or feedback?
*   **Interest in Custom Version:** Would you be interested in a custom version of this tool for your own business? (Yes/No)
*   **Custom Version Details:** If yes, what specific requirements would you have for a custom version?
*   **Your Role:** What is your role? (e.g., Client, Architect, Designer)
*   **Other Role (Specify):** If "Other", please specify.
*   **Team Size:** What is the size of your team?
*   **Would you recommend this tool?** (Yes/No)
*   **Can we contact you for follow-up?** (Yes/No)
*   **Contact Info (if permission given):** Please provide your email if you're open to being contacted.
*   **Feedback Comments (General):** Any final comments on the feedback process.
*   **Call Availability (for feedback):** If open to a call, when are you typically available? 