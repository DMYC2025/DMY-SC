// Supabase Configuration
// මෙම ෆයිල් එක Admin සහ User පිටු සියල්ලටම පොදු වේ.

const supabaseUrl = 'https://tnrqasiiywcvtwkwytqe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRucnFhc2lpeXdjdnR3a3d5dHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNDIxMTEsImV4cCI6MjA4MjkxODExMX0.rd9aKmLa687zMxg8FV5AllgnYkz7wpdXBRi3a5NyXc4';

// Create a single supabase client for interacting with your database
const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log("Supabase Connected! - supabase.js:10");