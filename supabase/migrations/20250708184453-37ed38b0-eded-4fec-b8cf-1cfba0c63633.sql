-- Insert additional vendor_details records to match all 50 vendors
-- First, let's get the vendor IDs that don't have vendor_details yet
INSERT INTO vendor_details (vendor_id, overall_gr, no_of_images, subscription, question_com, review)
SELECT 
  v.id,
  ROUND((RANDOM() * 1.5 + 3.5)::numeric, 1) as overall_gr, -- Random rating between 3.5-5.0
  FLOOR(RANDOM() * 50 + 10)::integer as no_of_images, -- Random images between 10-60
  CASE 
    WHEN RANDOM() < 0.3 THEN 'basic'
    WHEN RANDOM() < 0.7 THEN 'premium' 
    ELSE 'enterprise'
  END as subscription,
  'Professional service provider with experience in events' as question_com,
  'Excellent service quality and customer satisfaction' as review
FROM vendors v
LEFT JOIN vendor_details vd ON v.id = vd.vendor_id
WHERE vd.vendor_id IS NULL;