import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://https://oaovywqdgxhckrknyicf.supabase.co.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hb3Z5d3FkZ3hoY2tya255aWNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDA1MTMsImV4cCI6MjEwMjAxNjUxM30.Jl26NxPUbC90LorTM7eHeNzh0EaOhUKLamgO9PVML78'
)

const { data, error } = await supabase.from('lost_items').select('*').limit(1)
console.log(data, error)