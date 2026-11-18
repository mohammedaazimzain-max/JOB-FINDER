/* =========================================
   SAMPLE JOB DATA
========================================= */

const JOBS = [

    {
        id: 1,
        title: "Frontend Developer",
        company: "Pixel Works",
        source: "LinkedIn",
        location: "Remote",
        remote: true,
        minYears: 2,
        skills: ["JavaScript", "React", "CSS"],
        posted: "2026-08-20"
    },

    {
        id: 2,
        title: "Backend Developer",
        company: "Data Forge",
        source: "Indeed",
        location: "Bengaluru",
        remote: false,
        minYears: 3,
        skills: ["C++", "SQL", "Linux"],
        posted: "2026-08-22"
    },

    {
        id: 3,
        title: "Full Stack Developer",
        company: "Open Systems",
        source: "Greenhouse",
        location: "Remote",
        remote: true,
        minYears: 3,
        skills: ["JavaScript", "React", "Node.js", "SQL"],
        posted: "2026-08-24"
    },

    {
        id: 4,
        title: "Junior Web Developer",
        company: "Bright Labs",
        source: "AngelList",
        location: "Remote",
        remote: true,
        minYears: 1,
        skills: ["HTML", "CSS", "JavaScript"],
        posted: "2026-08-18"
    },

    {
        id: 5,
        title: "Software Engineer",
        company: "North Star Technologies",
        source: "LinkedIn",
        location: "Hyderabad",
        remote: false,
        minYears: 4,
        skills: ["C++", "Python", "Git"],
        posted: "2026-08-23"
    },

    {
        id: 6,
        title: "React Developer",
        company: "Interface Studio",
        source: "Indeed",
        location: "Remote",
        remote: true,
        minYears: 2,
        skills: ["React", "JavaScript", "CSS"],
        posted: "2026-08-25"
    },

    {
        id: 7,
        title: "Database Developer",
        company: "Table Systems",
        source: "Greenhouse",
        location: "Pune",
        remote: false,
        minYears: 2,
        skills: ["SQL", "Python", "Database"],
        posted: "2026-08-21"
    },

    {
        id: 8,
        title: "Web Designer",
        company: "Creative Grid",
        source: "AngelList",
        location: "Remote",
        remote: true,
        minYears: 1,
        skills: ["HTML", "CSS", "JavaScript"],
        posted: "2026-08-26"
    },

    {
        id: 9,
        title: "C++ Developer",
        company: "Engine Labs",
        source: "LinkedIn",
        location: "Chennai",
        remote: false,
        minYears: 3,
        skills: ["C++", "Git", "Linux"],
        posted: "2026-08-19"
    },

    {
        id: 10,
        title: "JavaScript Engineer",
        company: "Web Dynamics",
        source: "Indeed",
        location: "Remote",
        remote: true,
        minYears: 2,
        skills: ["JavaScript", "React", "Node.js"],
        posted: "2026-08-27"
    }

];


/* =========================================
   APPLICATION STATE
========================================= */

let skills = [];

let activeSource = "all";

let sortMode = "match";

let candidate = {
    years: 3,
    location: "Remote",
    remoteOnly: true
};


/* =========================================
   GET HTML ELEMENTS
========================================= */

const chipListEl =
    document.getElementById("chip-list");

const skillsInput =
    document.getElementById("skills-input");

const form =
    document.getElementById("intake-form");

const jobListEl =
    document.getElementById("job-list");

const emptyStateEl =
    document.getElementById("empty-state");

const resultsCountEl =
    document.getElementById("results-count");

const folderTabsEl =
    document.getElementById("folder-tabs");

const sortSelect =
    document.getElementById("sort-select");


/* =========================================
   ADD A SKILL
========================================= */

function addSkill(raw) {

    // Remove spaces from the beginning and end.
    const value = raw.trim();

    // Do nothing if the user entered nothing.
    if (!value) {
        return;
    }

    /*
        Check whether the skill already exists.

        Example:

        "JavaScript"
        and
        "javascript"

        are considered the same.
    */

    const exists = skills.some(
        skill =>
            skill.toLowerCase() === value.toLowerCase()
    );

    // Only add the skill if it is not already there.
    if (!exists) {
        skills.push(value);
    }

    // Update the visible chips.
    renderChips();
}


/* =========================================
   REMOVE A SKILL
========================================= */

function removeSkill(value) {

    /*
        Keep every skill except the one
        that the user wants to remove.
    */

    skills = skills.filter(
        skill => skill !== value
    );

    renderChips();
}


/* =========================================
   DISPLAY SKILL CHIPS
========================================= */

function renderChips() {

    // Remove the existing chips.
    chipListEl.innerHTML = "";

    // Create a chip for every skill.
    skills.forEach(skill => {

        const chip =
            document.createElement("span");

        chip.className = "chip";

        /*
            innerHTML allows us to create the
            remove button inside the chip.

            escapeHtml() protects the text
            from being interpreted as HTML.
        */

        chip.innerHTML = `
            ${escapeHtml(skill)}

            <button
                type="button"
                aria-label="Remove ${escapeHtml(skill)}"
            >
                ×
            </button>
        `;

        // Find the button inside this chip.
        const button =
            chip.querySelector("button");

        // When clicked, remove the skill.
        button.addEventListener(
            "click",
            () => removeSkill(skill)
        );

        // Add the chip to the page.
        chipListEl.appendChild(chip);
    });
}


/* =========================================
   SKILL INPUT
========================================= */

skillsInput.addEventListener(
    "keydown",
    function (e) {

        /*
            Pressing Enter or comma
            creates a new skill.
        */

        if (
            e.key === "Enter" ||
            e.key === ","
        ) {

            // Prevent the form from submitting.
            e.preventDefault();

            // Add the skill.
            addSkill(skillsInput.value);

            // Clear the input.
            skillsInput.value = "";
        }
    }
);


/* =========================================
   DEFAULT SKILLS
========================================= */

[
    "JavaScript",
    "React",
    "SQL"
].forEach(addSkill);


/* =========================================
   CALCULATE JOB MATCH
========================================= */

function computeMatch(job, candidate) {

    /*
        Convert the candidate's skills
        to lowercase so comparisons are
        case-insensitive.
    */

    const candidateSkills =
        skills.map(
            skill => skill.toLowerCase()
        );


    /*
        Find which job skills the candidate has.
    */

    const matchedSkills =
        job.skills.filter(
            skill =>
                candidateSkills.includes(
                    skill.toLowerCase()
                )
        );


    /*
        Skill score:

        If a job has 4 required skills
        and the candidate has 2:

        2 / 4 = 0.5
    */

    const skillScore =
        job.skills.length > 0
            ? matchedSkills.length / job.skills.length
            : 1;


    /*
        Experience score.

        If the job requires 3 years
        and the candidate has 2:

        2 / 3 = 0.67

        We never allow the score
        to become greater than 1.
    */

    const experienceScore =
        job.minYears === 0
            ? 1
            : Math.min(
                candidate.years / job.minYears,
                1
            );


    /*
        Location score.

        Remote jobs automatically
        receive a full location score.

        Otherwise we check whether
        the job location contains
        the candidate's location.
    */

    let locationScore;

    if (
        job.remote ||
        candidate.location.trim() === ""
    ) {

        locationScore = 1;

    } else if (
        job.location
            .toLowerCase()
            .includes(
                candidate.location
                    .trim()
                    .toLowerCase()
            )
    ) {

        locationScore = 1;

    } else {

        locationScore = 0.3;
    }


    /*
        Combine the three scores.

        Skills      = 60%
        Experience  = 25%
        Location    = 15%
    */

    const total =
        skillScore * 0.60 +
        experienceScore * 0.25 +
        locationScore * 0.15;


    return {
        percent: Math.round(total * 100),
        matchedSkills: matchedSkills
    };
}


/* =========================================
   MATCH STAMP
========================================= */

function stampFor(percent) {

    if (percent >= 80) {

        return {
            label: "QUALIFIED",
            cls: "stamp--qualified"
        };

    }

    if (percent >= 50) {

        return {
            label: "PARTIAL MATCH",
            cls: "stamp--partial"
        };

    }

    return {
        label: "NOT A FIT",
        cls: "stamp--pass"
    };
}


/* =========================================
   RENDER JOBS
========================================= */

function render() {

    /*
        First filter jobs by source.
    */

    let jobs = JOBS.filter(
        job =>
            activeSource === "all" ||
            job.source === activeSource
    );


    /*
        If "Remote jobs only" is enabled,
        remove non-remote jobs.
    */

    if (candidate.remoteOnly) {

        jobs = jobs.filter(
            job => job.remote
        );
    }


    /*
        Calculate the match percentage
        for every remaining job.
    */

    const scored =
        jobs.map(job => {

            const result =
                computeMatch(
                    job,
                    candidate
                );

            return {
                job: job,
                percent: result.percent,
                matchedSkills: result.matchedSkills
            };
        });


    /* =====================================
       SORT
    ====================================== */

    scored.sort(
        (a, b) => {

            // Sort by match percentage.
            if (sortMode === "match") {

                return b.percent - a.percent;
            }

            // Sort by posting date.
            return (
                new Date(b.job.posted) -
                new Date(a.job.posted)
            );
        }
    );


    /* =====================================
       RESULTS COUNT
    ====================================== */

    resultsCountEl.textContent =
        `${scored.length} listing${
            scored.length === 1
                ? ""
                : "s"
        }`;


    /* =====================================
       CLEAR OLD JOB CARDS
    ====================================== */

    jobListEl.innerHTML = "";


    /* =====================================
       EMPTY STATE
    ====================================== */

    emptyStateEl.hidden =
        scored.length > 0;


    /* =====================================
       CREATE JOB CARDS
    ====================================== */

    scored.forEach(
        ({ job, percent, matchedSkills }) => {

            const stamp =
                stampFor(percent);


            const card =
                document.createElement("article");

            card.className = "job-card";


            /*
                Create the HTML for the job card.
            */

            card.innerHTML = `

                <div>

                    <h3 class="job-card__title">
                        ${escapeHtml(job.title)}
                    </h3>

                    <p class="job-card__meta">

                        ${escapeHtml(job.company)}

                        <span class="dot">·</span>

                        ${escapeHtml(job.location)}

                        <span class="dot">·</span>

                        ${escapeHtml(job.source)}

                    </p>


                    <ul class="job-card__skills">

                        ${job.skills
                            .map(skill => {

                                /*
                                    Check whether this skill
                                    matches one of the candidate's
                                    skills.
                                */

                                const isMatched =
                                    matchedSkills.includes(skill);

                                const matchedClass =
                                    isMatched
                                        ? "is-matched"
                                        : "";

                                return `
                                    <li class="${matchedClass}">
                                        ${escapeHtml(skill)}
                                    </li>
                                `;
                            })
                            .join("")}

                    </ul>

                                    

                    <!-- AI EXPLANATION BUTTON -->

                    <div class="job-card__ai">

                        <button
                            class="ai-explain-btn"
                            type="button"
                        >
                            ASK GEMINI
                        </button>

                        <div
                            class="ai-explanation"
                            hidden
                            aria-live="polite"
                        ></div>

                    </div>

                </div>


                <div class="stamp ${stamp.cls}">

                    ${stamp.label}

                    <span class="stamp__pct">
                        ${percent}%
                    </span>

                </div>
            `;


            /*
                Put the finished card
                into the job list.
            */

            jobListEl.appendChild(card);
        }
    );
}


/* =========================================
   HTML ESCAPING
========================================= */

function escapeHtml(str) {

    /*
        Convert special characters into
        safe HTML entities.

        Example:

        < becomes &lt;
        > becomes &gt;
        & becomes &amp;
    */

    return str.replace(
        /[&<>"']/g,
        function (character) {

            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character];
        }
    );
}


/* =========================================
   FORM SUBMISSION
========================================= */

form.addEventListener(
    "submit",
    function (e) {

        /*
            Stop the browser from
            reloading the page.
        */

        e.preventDefault();


        /*
            Read the candidate information
            from the form.
        */

        candidate = {

            years:
                Number(
                    document.getElementById(
                        "years-input"
                    ).value
                ) || 0,

            location:
                document.getElementById(
                    "location-input"
                ).value,

            remoteOnly:
                document.getElementById(
                    "remote-only"
                ).checked
        };


        /*
            Recalculate the jobs.
        */

        render();
    }
);


/* =========================================
   SOURCE TAB BUTTONS
========================================= */

folderTabsEl.addEventListener(
    "click",
    function (e) {

        /*
            Find the folder tab
            that was clicked.
        */

        const btn =
            e.target.closest(
                ".folder-tab"
            );


        /*
            If something other than a
            folder tab was clicked, stop.
        */

        if (!btn) {
            return;
        }


        /*
            Remove the active state
            from all tabs.
        */

        folderTabsEl
            .querySelectorAll(".folder-tab")
            .forEach(tab => {

                tab.classList.remove(
                    "is-active"
                );

                tab.setAttribute(
                    "aria-selected",
                    "false"
                );
            });


        /*
            Activate the clicked tab.
        */

        btn.classList.add(
            "is-active"
        );

        btn.setAttribute(
            "aria-selected",
            "true"
        );


        /*
            Read the source from
            data-source="..."
        */

        activeSource =
            btn.dataset.source;


        /*
            Update the jobs.
        */

        render();
    }
);


/* =========================================
   SORT SELECT
========================================= */

sortSelect.addEventListener(
    "change",
    function (e) {

        /*
            Get the selected option.

            Either:

            "match"

            or:

            "date"
        */

        sortMode = e.target.value;

        render();
    }
);


/* =========================================
   FIRST RENDER
========================================= */

/*
    Run the application for the
    first time when the page loads.
*/

render();

/* =========================================
   GEMINI AI CONNECTION
========================================= */

jobListEl.addEventListener("click", async function(e) {

    // Check whether the clicked element is our AI button.
    const button = e.target.closest(".ai-explain-btn");

    // Ignore clicks on anything else.
    if (!button) {
        return;
    }

    // Find the job card containing the button.
    const card = button.closest(".job-card");

    // Find the explanation area inside that card.
    const explanation = card.querySelector(".ai-explanation");

    // Find the position of this card in the job list.
    const cards = Array.from(jobListEl.children);
    const index = cards.indexOf(card);

    // Get the original job information.
    const job = JOBS.filter(job =>
        activeSource === "all" || job.source === activeSource
    ).filter(job =>
        !candidate.remoteOnly || job.remote
    ).sort((a, b) => {
        if (sortMode === "match") {
            return computeMatch(b, candidate).percent -
                   computeMatch(a, candidate).percent;
        }

        return new Date(b.posted) - new Date(a.posted);
    })[index];

    if (!job) {
        return;
    }

    // Show a loading message.
    button.disabled = true;
    button.textContent = "ASKING GEMINI...";
    explanation.hidden = false;
    explanation.textContent = "Gemini is analysing your skills...";

    try {

        // Send the job and candidate skills to Vercel.
        const response = await fetch(
            "https://api-six-beta-85.vercel.app/api/gemini",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    job: job,
                    skills: skills
                })
            }
        );

        const data = await response.json();

        // Check whether the API returned an error.
        if (!response.ok) {
            throw new Error(data.error || "Gemini request failed.");
        }

        // Display Gemini's explanation safely.
        explanation.textContent = data.explanation;

    } catch (error) {

        console.error("Gemini error:", error);

        explanation.textContent =
            "Sorry! Unable to generate an explanation. " +
            error.message;

    } finally {

        // Restore the button.
        button.disabled = false;
        button.textContent = "ASK GEMINI";
    }

});
