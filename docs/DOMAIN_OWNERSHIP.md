# Domain Ownership

This document defines ownership of ERP database tables.

Each table has one owning domain.
Only the owning domain should modify its table structure.

## Core / Identity

- users
- refresh_tokens
- password_reset_tokens
- email_verification_tokens

## Academic

- branches
- semesters
- academic_years
- subjects
- timetables

## Student

- students
- academic_details

## Faculty / HR

- teachers
- non_teaching_staff
- teacher_subjects

## Enrollment

- enrollments

## Attendance

- attendance_* (future)

## Grading

- marks
- exam_* (future)
- grades_* (future)
- results_* (future)

## Finance

- fee_* (future)
- payment_* (future)

## Placement

- placement_cells
- placements
- companies_* (future)
- job_postings_* (future)
- applications_* (future)

## Notifications

- notifications