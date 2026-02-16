const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function main() {
  // Clear existing data
  await prisma.option.deleteMany({})
  await prisma.question.deleteMany({})
  await prisma.progress.deleteMany({})
  await prisma.case.deleteMany({})
  await prisma.doctor.deleteMany({})

  console.log('Seeding Database...')

  const casesParams = [
    {
      id: "49026835-76d5-48fd-9205-20a78957b727",
      sequence_order: 1,
      title: "Cycle Regularization Challenge",
      description: "Patient Presentation\nAge: 28\nPresenting Complaint: Irregular menstrual bleeding and spotting.\nRelevant History: History of irregular cycles since menarche. BMI 24.",
      correct_outcome_text: "Clinical condition stabilizes with appropriate hormonal support.",
      clinical_insight_text: "DUFOGEN (Dydrogesterone) plays a key role in endometrial stability and cycle regulation.",
      presentation_media_url: "https://www.youtube.com/watch?v=ezzakrmrvt0",
      outcome_media_url: "video",
      question: "Based on the above findings, what is the most appropriate next step?",
      options: [
        { text: "Prescribe DUFOGEN 10mg BID", is_correct: true },
        { text: "Recommend lifestyle changes only", is_correct: false },
        { text: "Refer for immediate surgery", is_correct: false },
        { text: "Prescribe combined oral contraceptives", is_correct: false },
      ]
    },
    {
      id: "2cf1f9ba-d63d-406f-bbf9-0dc2989a174d",
      sequence_order: 2,
      title: "Luteal Phase Support",
      description: "Patient Presentation\nAge: 32\nPresenting Complaint: Difficulty conceiving and premenstrual spotting.\nRelevant History: Trying to conceive for 18 months. Short luteal phase suspected.",
      correct_outcome_text: "Luteal phase is supported, improving chances of implantation and pregnancy maintenance.",
      clinical_insight_text: "Adequate progesterone support with DUFOGEN during the luteal phase is crucial for endometrial receptivity.",
      presentation_media_url: "https://www.youtube.com/watch?v=0mVRUDE3cyo",
      outcome_media_url: "video",
      question: "What is the recommended management for suspected luteal phase defect?",
      options: [
        { text: "DUFOGEN support in luteal phase", is_correct: true },
        { text: "Clomiphene Citrate alone", is_correct: false },
        { text: "Metaformin therapy", is_correct: false },
        { text: "Reassurance and observation", is_correct: false },
      ]
    },
    {
      id: "db60bf83-6f30-4f30-90d1-032e22f3d38d",
      sequence_order: 3,
      title: "Threatened Pregnancy",
      description: "Patient Presentation\nAge: 28, G1P0\nPresenting Complaint: Mild vaginal spotting and cramping at 8 weeks.\nRelevant History: Viable intrauterine pregnancy confirmed by USG.",
      correct_outcome_text: "Pregnancy continues successfully. Bleeding and cramping subside.",
      clinical_insight_text: "In threatened miscarriage, DUFOGEN reduces risk of pregnancy loss by modulating immune response.",
      presentation_media_url: "https://www.youtube.com/watch?v=FjesPZJlmSA",
      outcome_media_url: "video",
      question: "What is the recommended pharmacological support?",
      options: [
        { text: "DUFOGEN 40mg STAT then 10mg BID", is_correct: true },
        { text: "Bed rest alone", is_correct: false },
        { text: "Immediate D&C", is_correct: false },
        { text: "Aspirin 75mg", is_correct: false },
      ]
    },
    {
      id: "4735acce-9c29-4840-899c-eaff65656bcb",
      sequence_order: 4,
      title: "IVF Support",
      description: "Patient Presentation\nAge: 35\nPresenting Complaint: Post-oocyte retrieval preparation.\nRelevant History: Undergoing IVF. Preparing for fresh embryo transfer.",
      correct_outcome_text: "Endometrial receptivity is optimized, leading to successful implantation.",
      clinical_insight_text: "DUFOGEN is an effective oral alternative to vaginal progesterone for luteal support in IVF.",
      presentation_media_url: "https://www.youtube.com/watch?v=BBfBckNakcU",
      outcome_media_url: "video",
      question: "Which agent would you choose for luteal phase support?",
      options: [
        { text: "Oral DUFOGEN", is_correct: true },
        { text: "Clomiphene Citrate", is_correct: false },
        { text: "Letrozole", is_correct: false },
        { text: "Metformin", is_correct: false },
      ]
    },
    {
      id: "d1baa5fe-cf7b-4347-9b0b-70a076db4b08",
      sequence_order: 5,
      title: "PMS Management",
      description: "Patient Presentation\nAge: 25\nPresenting Complaint: Severe mood swings and bloating before menses.\nRelevant History: Symptoms interfere with daily life, resolving after menses.",
      correct_outcome_text: "Symptom severity is significantly reduced, improving quality of life.",
      clinical_insight_text: "PMS can be managed with DUFOGEN during the luteal phase to counter relative progesterone deficiency.",
      presentation_media_url: "https://www.youtube.com/watch?v=-yBYviQJKPY",
      outcome_media_url: "video",
      question: "What reflects an appropriate management strategy?",
      options: [
        { text: "DUFOGEN from Day 11-25 of cycle", is_correct: true },
        { text: "SSRI continuous therapy only", is_correct: false },
        { text: "Hysterectomy", is_correct: false },
        { text: "Anxiolytics", is_correct: false },
      ]
    }
  ]

  for (const caseData of casesParams) {
    const newCase = await prisma.case.create({
      data: {
        id: caseData.id,
        sequence_order: caseData.sequence_order,
        title: caseData.title,
        description: caseData.description,
        correct_outcome_text: caseData.correct_outcome_text,
        clinical_insight_text: caseData.clinical_insight_text,
        presentation_media_url: caseData.presentation_media_url,
        outcome_media_url: caseData.outcome_media_url,
        questions: {
          create: {
            text: caseData.question,
            options: {
              create: caseData.options
            }
          }
        }
      }
    })
    console.log(`Created case: ${newCase.title} with ID: ${newCase.id}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
