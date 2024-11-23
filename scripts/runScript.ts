import collectUserLinkedInData from '@/lib/data/collectors/collectUserLinkedInData'
import fs from 'fs/promises'
import path from 'path'
import prisma from '@/lib/prisma'
console.log(
  'This is a standalone script running in a Next.js TypeScript project.'
)

async function main() {
  const user = await prisma.user.findFirst({
    where: { id: 'cm3na74bg0000aqtvvb5ysh26' }
  })

  console.log('User:', user)

  if (!user?.linkedinAccessToken) {
    throw new Error('User not found')
  }

  const userLinkedInData = await collectUserLinkedInData(
    user.linkedinAccessToken
  )

  console.log('User LinkedIn Data:', userLinkedInData)

  // Save to file
  const outputPath = path.join(process.cwd(), 'userLinkedinData.txt')
  await fs.writeFile(
    outputPath,
    JSON.stringify(userLinkedInData, null, 2),
    'utf-8'
  )
  await prisma.$disconnect()
}

main()
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
