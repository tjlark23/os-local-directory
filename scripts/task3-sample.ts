import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://wdodhzqgmumrwgfihagc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'
)

async function task3() {
  console.log()
  console.log('='.repeat(70))
  console.log('TASK 3: SAMPLE BY CATEGORY (2 each)')
  console.log('='.repeat(70))

  const categories = [
    { name: 'restaurants', label: 'RESTAURANTS' },
    { name: 'health', label: 'HEALTH' },
    { name: 'beauty', label: 'BEAUTY' },
    { name: 'fitness', label: 'FITNESS' },
    { name: 'automotive', label: 'AUTOMOTIVE' }
  ]

  for (const cat of categories) {
    const { data } = await supabase
      .from('businesses')
      .select('name, address_street, category, image, rating, review_count, phone')
      .ilike('address_city', '%round rock%')
      .ilike('category', '%' + cat.name + '%')
      .limit(2)

    console.log()
    console.log(cat.label + ':')
    console.log('-'.repeat(70))

    if (!data || data.length === 0) {
      console.log('  No businesses found in this category')
      continue
    }

    for (const b of data) {
      console.log('  ' + b.name)
      console.log('    Address: ' + (b.address_street || 'N/A'))
      console.log('    Rating: ' + b.rating + ' stars (' + b.review_count + ' reviews)')
      console.log('    Phone: ' + (b.phone || 'N/A'))
      console.log('    Photo: ' + (b.image ? 'Yes' : 'No'))
    }
  }
}

task3().catch(console.error)
