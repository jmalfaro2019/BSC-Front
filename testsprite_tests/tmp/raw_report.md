
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** FRONT
- **Date:** 2026-05-02
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Sign in and reach the dashboard
- **Test Code:** [TC001_Sign_in_and_reach_the_dashboard.py](./TC001_Sign_in_and_reach_the_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5d3d301c-ab53-4f3c-90f3-8f7cd3e69a2a/8a5b435f-6ca2-45cb-908d-a4efd0998da7
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 Update an activity progress via data entry and see it reflected in Actions and Weightings
- **Test Code:** [TC002_Update_an_activity_progress_via_data_entry_and_see_it_reflected_in_Actions_and_Weightings.py](./TC002_Update_an_activity_progress_via_data_entry_and_see_it_reflected_in_Actions_and_Weightings.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5d3d301c-ab53-4f3c-90f3-8f7cd3e69a2a/f34a8fef-951f-46c9-83d9-c0f99974b504
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 View perspectives progress and KPI summary on dashboard
- **Test Code:** [TC003_View_perspectives_progress_and_KPI_summary_on_dashboard.py](./TC003_View_perspectives_progress_and_KPI_summary_on_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5d3d301c-ab53-4f3c-90f3-8f7cd3e69a2a/dde2cd84-4936-49e0-abb0-acccde93b663
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 View activities grouped by project and inspect progress/responsibles
- **Test Code:** [TC004_View_activities_grouped_by_project_and_inspect_progressresponsibles.py](./TC004_View_activities_grouped_by_project_and_inspect_progressresponsibles.py)
- **Test Error:** TEST BLOCKED

The sign-in page did not load so the test cannot proceed. The UI is blank and there are no interactive elements to perform authentication or navigate to the Actions view.

Observations:
- Navigated to /signin but the page is blank with 0 interactive elements.
- No login form or navigation links are present to continue the test.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5d3d301c-ab53-4f3c-90f3-8f7cd3e69a2a/931313ec-3801-4442-9c9f-79f3cdd2185b
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 View weightings hierarchy and inspect weight and progress indicators
- **Test Code:** [TC005_View_weightings_hierarchy_and_inspect_weight_and_progress_indicators.py](./TC005_View_weightings_hierarchy_and_inspect_weight_and_progress_indicators.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5d3d301c-ab53-4f3c-90f3-8f7cd3e69a2a/f69cd4cf-de91-41c1-979d-36210d21a449
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Browse projects grouped by perspective
- **Test Code:** [TC006_Browse_projects_grouped_by_perspective.py](./TC006_Browse_projects_grouped_by_perspective.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5d3d301c-ab53-4f3c-90f3-8f7cd3e69a2a/f166f879-9e3b-447a-bf0b-a6b006e965c8
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Cascading selects enablement from perspective to project to activity
- **Test Code:** [TC007_Cascading_selects_enablement_from_perspective_to_project_to_activity.py](./TC007_Cascading_selects_enablement_from_perspective_to_project_to_activity.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached — the frontend did not render the application UI so the test cannot proceed.

Observations:
- Navigated to http://localhost:5173 and http://localhost:5173/signin but the pages are blank/empty.
- The page shows 0 interactive elements, so the sign-in form and dropdowns are not available.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5d3d301c-ab53-4f3c-90f3-8f7cd3e69a2a/2606a652-619d-4aac-82cf-28ca9b9f210e
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Expand and collapse perspective sections in Projects view
- **Test Code:** [TC008_Expand_and_collapse_perspective_sections_in_Projects_view.py](./TC008_Expand_and_collapse_perspective_sections_in_Projects_view.py)
- **Test Error:** TEST FAILURE

Clicking the perspective header did not collapse the section — the contained projects remained visible after attempts to collapse.

Observations:
- After two clicks on the 'CONOCIMIENTO Y APRENDIZAJE' header, the section stayed expanded and the UI did not hide its project cards.
- The project titles 'Ubuntu - todos por el mismo propósito', 'Capital humano', and 'Cultura de calidad y solidaria' are present and visible on the page.
- Two collapse attempts were made and neither changed the section state.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5d3d301c-ab53-4f3c-90f3-8f7cd3e69a2a/058fc0e3-3c30-4a6b-b17d-df275858a05b
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Expand and collapse a project section to show and hide its activities
- **Test Code:** [TC009_Expand_and_collapse_a_project_section_to_show_and_hide_its_activities.py](./TC009_Expand_and_collapse_a_project_section_to_show_and_hide_its_activities.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached — the sign-in page did not load, so the test cannot be executed.

Observations:
- Navigated to /signin but the page is blank with no interactive elements visible.
- The SPA did not render the login form or any navigation links.
- No UI exists on the page to perform sign-in or access project sections.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5d3d301c-ab53-4f3c-90f3-8f7cd3e69a2a/df95376e-4bef-428e-80ff-4c28fa970b40
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 View actions across perspectives without expanding any project
- **Test Code:** [TC010_View_actions_across_perspectives_without_expanding_any_project.py](./TC010_View_actions_across_perspectives_without_expanding_any_project.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5d3d301c-ab53-4f3c-90f3-8f7cd3e69a2a/e5311e32-7bac-40e1-aa8f-64615ff20241
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Collapse expanded weightings sections to return to a higher-level view
- **Test Code:** [TC011_Collapse_expanded_weightings_sections_to_return_to_a_higher_level_view.py](./TC011_Collapse_expanded_weightings_sections_to_return_to_a_higher_level_view.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached — the single-page app did not load, so the sign-in form and Weightings view are inaccessible.

Observations:
- The page rendered as a blank white screen (screenshot shows empty page)
- There are 0 interactive elements on the page
- Navigations to / and /signin and waits were attempted but the app never finished loading
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5d3d301c-ab53-4f3c-90f3-8f7cd3e69a2a/bed9c2da-5543-45ef-85c6-c5fd52962826
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 Validate required selections when submitting without project or activity
- **Test Code:** [TC012_Validate_required_selections_when_submitting_without_project_or_activity.py](./TC012_Validate_required_selections_when_submitting_without_project_or_activity.py)
- **Test Error:** TEST FAILURE

Submitting the update after selecting only a perspective did not show a validation error indicating required selections are missing.

Observations:
- After clicking to submit, no validation or error message was visible on the page.
- The form still shows placeholders: 'Seleccione un proyecto...' and 'Seleccione una actividad...'.
- The progress value remained at 0% and no required-field message appeared.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5d3d301c-ab53-4f3c-90f3-8f7cd3e69a2a/8223cab2-7e06-45fc-8ab1-62448112ecea
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Auto-scroll to an expanded project section
- **Test Code:** [TC013_Auto_scroll_to_an_expanded_project_section.py](./TC013_Auto_scroll_to_an_expanded_project_section.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5d3d301c-ab53-4f3c-90f3-8f7cd3e69a2a/c4387931-6a2c-470b-8379-9fd95d3c000b
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Expand two different project sections and inspect both activity lists
- **Test Code:** [TC014_Expand_two_different_project_sections_and_inspect_both_activity_lists.py](./TC014_Expand_two_different_project_sections_and_inspect_both_activity_lists.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5d3d301c-ab53-4f3c-90f3-8f7cd3e69a2a/0266c566-802e-4f93-b9c5-63bd36c6d962
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015 Expand multiple perspectives in the weightings table
- **Test Code:** [TC015_Expand_multiple_perspectives_in_the_weightings_table.py](./TC015_Expand_multiple_perspectives_in_the_weightings_table.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5d3d301c-ab53-4f3c-90f3-8f7cd3e69a2a/10fcf534-b8ad-433d-b4c0-03c41d6a072f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **60.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---