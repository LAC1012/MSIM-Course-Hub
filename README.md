# MSIM-Course-Hub
## About
The MSIM course hub is designed to centralize course formation that is currently scattered across platforms such as MyPlan, iSchool course directory, and time schedules that get updated quarterly. Its target audience is current MSIM students who need reliable, consistent access to course details and peer reviews when planning their academic path. Insights on workload, homework, career relevance, and overall course sentiment are consolidated into a simple website that displays data scraped from the MSIM course catalog alongside student survey responses, with the information stored in a CSV file.

## Methodology
- Course information is scraped and consolidated from fragmented MSIM course catalogue alongside student survey responses
- Data is standardized using keyword matching logic to support searches using course codes, course names, or career goals. 
- Students can also ask questions in natural language in the query, and a recommendation model will return relevant courses
- Queries that match with existing information in the database will be displayed on the website

## Access
- The users search “MSIM course hub” online or receives the link from classmates or advisor
- Go to the website and land on homepage
- They can search for a course by entering course name or course number using a centralized search interface
- They can also enter their career interest in sentences
- After selecting a course, the user can view course reviews in detail, including workload, learning content, and time commitment
- If they have taken a course before, they can also submit a new course review to help students in the future who might be interested in the course
- The submitted review is added to the database and can be displayed as search results.


## Structure
| Field | Type | Value |
|------|------|-------------|
| `msim_class_code` | string | IMT 500 |
| `msim_class_name` | string | Foundations of Information Management
| `professor_full_name` | string | Jim Loter |
| `hw_hours` | string | 2 to 4 hours |
| `assignment_types` | string | Weekly written assignments below 1000 words (case studies, reflections), Readings, Group projects, Presentation, Final paper (research papers, reports) |
| `intended_field` | string | UX Design or UX Research, Product/Program Management and Consulting, Information Architecture |
| `career_relevance_score` | number | 3 |
| `portfolio_project_created` | boolean | No |
| `additional_insights` | string | There were some miscommunication about assignment requirements because the professor was a guest lecturer or was teaching another professor's material. Professor's knowledge was great and teaching style was very engaging. Weekly written assignments were interesting because they directly apply the learning materials to a real-world case, but got repetitive near the end. |

## Example
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MSIM Course Hub</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;600&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="page" data-node-id="1:12">
      <header class="header" data-node-id="8:599">
        <div class="header__inner" data-node-id="I8:599;8:593">
          <p class="header__logo" data-node-id="I8:599;8:586">MSIM Course Hub</p>
          <nav class="header__nav" data-node-id="I8:599;8:592" aria-label="Main">
            <a href="#" class="header__link" data-node-id="I8:599;8:588">Home</a>
            <a href="#" class="header__link" data-node-id="I8:599;8:589">Review a Class</a>
          </nav>
        </div>
        <div class="header__divider" data-node-id="I8:599;8:594" aria-hidden="true">
          <img src="assets/header-line.svg" alt="" width="1440" height="1" />
        </div>
      </header>

      <main class="hero">
        <p class="hero__label" data-node-id="1:23">
          UNIVERSITY OF WASHINGTON &nbsp;•&nbsp; iSCHOOL
        </p>
        <h1 class="hero__title" data-node-id="1:24">
          What do you want to <em>learn</em>?
        </h1>
        <p class="hero__subtitle" data-node-id="1:25">
          Search by course name, course number or professor name
        </p>
        <form class="search-bar" data-node-id="8:141" role="search" aria-label="Course search">
          <img
            class="search-bar__icon"
            src="assets/magnifying-glass.svg"
            alt=""
            width="16"
            height="16"
            data-node-id="I8:141;1:30"
          />
          <input
            type="search"
            class="search-bar__input"
            placeholder='Try "IMT 542" or "portable information structures" ...'
            data-node-id="I8:141;1:27"
            aria-label="Search courses"
          />
        </form>
      </main>
    </div>
  </body>
</html>
```
