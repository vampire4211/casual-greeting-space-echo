-- Insert sample customers
INSERT INTO public.customers (name, email, phone_number, gender) VALUES
('Priya Sharma', 'priya.sharma1@example.com', '+91-9876543210', 'Female'),
('Rahul Kumar', 'rahul.kumar2@example.com', '+91-9876543211', 'Male'),
('Anita Patel', 'anita.patel3@example.com', '+91-9876543212', 'Female'),
('Rajesh Singh', 'rajesh.singh4@example.com', '+91-9876543213', 'Male'),
('Kavya Reddy', 'kavya.reddy5@example.com', '+91-9876543214', 'Female'),
('Amit Gupta', 'amit.gupta6@example.com', '+91-9876543215', 'Male'),
('Sneha Joshi', 'sneha.joshi7@example.com', '+91-9876543216', 'Female'),
('Vikram Mehta', 'vikram.mehta8@example.com', '+91-9876543217', 'Male'),
('Deepika Agarwal', 'deepika.agarwal9@example.com', '+91-9876543218', 'Female'),
('Suresh Yadav', 'suresh.yadav10@example.com', '+91-9876543219', 'Male'),
('Meera Shah', 'meera.shah11@example.com', '+91-9876543220', 'Female'),
('Arjun Kapoor', 'arjun.kapoor12@example.com', '+91-9876543221', 'Male'),
('Pooja Verma', 'pooja.verma13@example.com', '+91-9876543222', 'Female'),
('Karan Malhotra', 'karan.malhotra14@example.com', '+91-9876543223', 'Male'),
('Riya Bansal', 'riya.bansal15@example.com', '+91-9876543224', 'Female'),
('Sanjay Mishra', 'sanjay.mishra16@example.com', '+91-9876543225', 'Male'),
('Nisha Tiwari', 'nisha.tiwari17@example.com', '+91-9876543226', 'Female'),
('Rohit Saxena', 'rohit.saxena18@example.com', '+91-9876543227', 'Male'),
('Ritika Sharma', 'ritika.sharma19@example.com', '+91-9876543228', 'Female'),
('Ajay Pandey', 'ajay.pandey20@example.com', '+91-9876543229', 'Male'),
('Shruti Agarwal', 'shruti.agarwal21@example.com', '+91-9876543230', 'Female'),
('Nikhil Jain', 'nikhil.jain22@example.com', '+91-9876543231', 'Male'),
('Divya Sinha', 'divya.sinha23@example.com', '+91-9876543232', 'Female'),
('Manish Dubey', 'manish.dubey24@example.com', '+91-9876543233', 'Male'),
('Priyanka Rai', 'priyanka.rai25@example.com', '+91-9876543234', 'Female'),
('Ashish Kumar', 'ashish.kumar26@example.com', '+91-9876543235', 'Male'),
('Swati Bhatt', 'swati.bhatt27@example.com', '+91-9876543236', 'Female'),
('Gaurav Thakur', 'gaurav.thakur28@example.com', '+91-9876543237', 'Male'),
('Neha Chopra', 'neha.chopra29@example.com', '+91-9876543238', 'Female'),
('Varun Sethi', 'varun.sethi30@example.com', '+91-9876543239', 'Male');

-- Insert sample vendors
INSERT INTO public.vendors (vendor_name, business_name, email, phone_number, age, gender, aadhar, pan, gst, address, categories) VALUES
('Rajesh Photography', 'Royal Photography Studio', 'rajesh@royalphotography.com', '+91-9876540001', 32, 'Male', 'XXXX-XXXX-1001', 'ABCDE1234F', '27ABCDE1234F1Z5', 'Mumbai, Maharashtra', ARRAY['Photography & Videography']),
('Sunita Catering', 'Delicious Catering Co.', 'sunita@deliciouscatering.com', '+91-9876540002', 28, 'Female', 'XXXX-XXXX-1002', 'BCDEF2345G', '07BCDEF2345G2Y4', 'Delhi, NCR', ARRAY['Catering Services']),
('Arjun Venues', 'Grand Palace Venues', 'arjun@grandpalace.com', '+91-9876540003', 45, 'Male', 'XXXX-XXXX-1003', 'CDEFG3456H', '29CDEFG3456H3X3', 'Bangalore, Karnataka', ARRAY['Venue']),
('Priya Decor', 'Elegant Decor Solutions', 'priya@elegantdecor.com', '+91-9876540004', 30, 'Female', 'XXXX-XXXX-1004', 'DEFGH4567I', '33DEFGH4567I4W2', 'Chennai, Tamil Nadu', ARRAY['Decor and Styling']),
('Ravi Music', 'Melody Music Band', 'ravi@melodymusic.com', '+91-9876540005', 35, 'Male', 'XXXX-XXXX-1005', 'EFGHI5678J', '27EFGHI5678J5V1', 'Pune, Maharashtra', ARRAY['Music, Anchors & Entertainment']),
('Kavita Makeup', 'Glamour Makeup Studio', 'kavita@glamourmakeup.com', '+91-9876540006', 26, 'Female', 'XXXX-XXXX-1006', 'FGHIJ6789K', '36FGHIJ6789K6U0', 'Hyderabad, Telangana', ARRAY['Personal Care and Grooming']),
('Manoj Events', 'Perfect Event Planners', 'manoj@perfectevents.com', '+91-9876540007', 38, 'Male', 'XXXX-XXXX-1007', 'GHIJK7890L', '24GHIJK7890L7T9', 'Jaipur, Rajasthan', ARRAY['Event Planner']),
('Neha Rentals', 'Royal Rentals', 'neha@royalrentals.com', '+91-9876540008', 29, 'Female', 'XXXX-XXXX-1008', 'HIJKL8901M', '19HIJKL8901M8S8', 'Lucknow, Uttar Pradesh', ARRAY['Rental Services']),
('Vikas Photo', 'Crystal Clear Photography', 'vikas@crystalclear.com', '+91-9876540009', 31, 'Male', 'XXXX-XXXX-1009', 'IJKLM9012N', '27IJKLM9012N9R7', 'Ahmedabad, Gujarat', ARRAY['Photography & Videography']),
('Rani Catering', 'Spice Garden Catering', 'rani@spicegarden.com', '+91-9876540010', 33, 'Female', 'XXXX-XXXX-1010', 'JKLMN0123O', '23JKLMN0123O0Q6', 'Kolkata, West Bengal', ARRAY['Catering Services']),
('Amit Venues', 'Majestic Banquet Halls', 'amit@majesticbanquet.com', '+91-9876540011', 42, 'Male', 'XXXX-XXXX-1011', 'KLMNO1234P', '27KLMNO1234P1P5', 'Indore, Madhya Pradesh', ARRAY['Venue']),
('Sonia Decor', 'Dream Decorators', 'sonia@dreamdecorators.com', '+91-9876540012', 27, 'Female', 'XXXX-XXXX-1012', 'LMNOP2345Q', '27LMNOP2345Q2O4', 'Bhopal, Madhya Pradesh', ARRAY['Decor and Styling']),
('Kiran Music', 'Harmony Entertainment', 'kiran@harmonyent.com', '+91-9876540013', 36, 'Male', 'XXXX-XXXX-1013', 'MNOPQ3456R', '27MNOPQ3456R3N3', 'Nagpur, Maharashtra', ARRAY['Music, Anchors & Entertainment']),
('Deepa Makeup', 'Beauty Bliss Studio', 'deepa@beautybliss.com', '+91-9876540014', 25, 'Female', 'XXXX-XXXX-1014', 'NOPQR4567S', '27NOPQR4567S4M2', 'Surat, Gujarat', ARRAY['Personal Care and Grooming']),
('Rohit Events', 'Elite Event Management', 'rohit@eliteevents.com', '+91-9876540015', 40, 'Male', 'XXXX-XXXX-1015', 'OPQRS5678T', '27OPQRS5678T5L1', 'Chandigarh, Punjab', ARRAY['Event Planner']),
('Meera Rentals', 'Premium Rental Services', 'meera@premiumrentals.com', '+91-9876540016', 32, 'Female', 'XXXX-XXXX-1016', 'PQRST6789U', '03PQRST6789U6K0', 'Gurgaon, Haryana', ARRAY['Rental Services']),
('Arun Photo', 'Artistic Vision Photography', 'arun@artisticvision.com', '+91-9876540017', 34, 'Male', 'XXXX-XXXX-1017', 'QRSTU7890V', '27QRSTU7890V7J9', 'Kochi, Kerala', ARRAY['Photography & Videography']),
('Lakshmi Catering', 'Traditional Taste Catering', 'lakshmi@traditionaltaste.com', '+91-9876540018', 37, 'Female', 'XXXX-XXXX-1018', 'RSTUV8901W', '32RSTUV8901W8I8', 'Coimbatore, Tamil Nadu', ARRAY['Catering Services']),
('Suresh Venues', 'Grand Celebration Halls', 'suresh@grandcelebration.com', '+91-9876540019', 46, 'Male', 'XXXX-XXXX-1019', 'STUVW9012X', '27STUVW9012X9H7', 'Vadodara, Gujarat', ARRAY['Venue']),
('Rekha Decor', 'Artistic Decorations', 'rekha@artisticdecorations.com', '+91-9876540020', 31, 'Female', 'XXXX-XXXX-1020', 'TUVWX0123Y', '27TUVWX0123Y0G6', 'Patna, Bihar', ARRAY['Decor and Styling']),
('Vikash Music', 'Rhythm Entertainment', 'vikash@rhythmentertainment.com', '+91-9876540021', 33, 'Male', 'XXXX-XXXX-1021', 'UVWXY1234Z', '10UVWXY1234Z1F5', 'Bhubaneswar, Odisha', ARRAY['Music, Anchors & Entertainment']),
('Anita Makeup', 'Glow Beauty Parlour', 'anita@glowbeauty.com', '+91-9876540022', 28, 'Female', 'XXXX-XXXX-1022', 'VWXYZ2345A', '27VWXYZ2345A2E4', 'Dehradun, Uttarakhand', ARRAY['Personal Care and Grooming']),
('Sachin Events', 'Celebration Experts', 'sachin@celebrationexperts.com', '+91-9876540023', 39, 'Male', 'XXXX-XXXX-1023', 'WXYZA3456B', '27WXYZA3456B3D3', 'Guwahati, Assam', ARRAY['Event Planner']),
('Seema Rentals', 'Luxury Rental Solutions', 'seema@luxuryrentals.com', '+91-9876540024', 35, 'Female', 'XXXX-XXXX-1024', 'XYZAB4567C', '27XYZAB4567C4C2', 'Ranchi, Jharkhand', ARRAY['Rental Services']),
('Dinesh Photo', 'Moments Photography', 'dinesh@momentsphotography.com', '+91-9876540025', 30, 'Male', 'XXXX-XXXX-1025', 'YZABC5678D', '27YZABC5678D5B1', 'Thiruvananthapuram, Kerala', ARRAY['Photography & Videography']),
('Poonam Catering', 'Royal Feast Catering', 'poonam@royalfeast.com', '+91-9876540026', 34, 'Female', 'XXXX-XXXX-1026', 'ZABCD6789E', '27ZABCD6789E6A0', 'Raipur, Chhattisgarh', ARRAY['Catering Services']),
('Mukesh Venues', 'Paradise Banquet', 'mukesh@paradisebanquet.com', '+91-9876540027', 43, 'Male', 'XXXX-XXXX-1027', 'ABCDE7890F', '27ABCDE7890F7Z9', 'Agra, Uttar Pradesh', ARRAY['Venue']),
('Nisha Decor', 'Creative Designs', 'nisha@creativedesigns.com', '+91-9876540028', 26, 'Female', 'XXXX-XXXX-1028', 'BCDEF8901G', '27BCDEF8901G8Y8', 'Kanpur, Uttar Pradesh', ARRAY['Decor and Styling']),
('Anil Music', 'Sound Waves Entertainment', 'anil@soundwaves.com', '+91-9876540029', 37, 'Male', 'XXXX-XXXX-1029', 'CDEFG9012H', '27CDEFG9012H9X7', 'Nashik, Maharashtra', ARRAY['Music, Anchors & Entertainment']),
('Sunita Makeup', 'Radiance Beauty Studio', 'sunita@radiancebeauty.com', '+91-9876540030', 29, 'Female', 'XXXX-XXXX-1030', 'DEFGH0123I', '27DEFGH0123I0W6', 'Aurangabad, Maharashtra', ARRAY['Personal Care and Grooming']),
('Manish Events', 'Grand Occasions', 'manish@grandoccasions.com', '+91-9876540031', 41, 'Male', 'XXXX-XXXX-1031', 'EFGHI1234J', '27EFGHI1234J1V5', 'Jodhpur, Rajasthan', ARRAY['Event Planner']),
('Kavita Rentals', 'Elite Rentals', 'kavita@eliterentals.com', '+91-9876540032', 33, 'Female', 'XXXX-XXXX-1032', 'FGHIJ2345K', '27FGHIJ2345K2U4', 'Mysore, Karnataka', ARRAY['Rental Services']),
('Rajesh Photo', 'Perfect Moments', 'rajesh@perfectmoments.com', '+91-9876540033', 32, 'Male', 'XXXX-XXXX-1033', 'GHIJK3456L', '27GHIJK3456L3T3', 'Jabalpur, Madhya Pradesh', ARRAY['Photography & Videography']),
('Shanti Catering', 'Tasty Treats Catering', 'shanti@tastytreats.com', '+91-9876540034', 36, 'Female', 'XXXX-XXXX-1034', 'HIJKL4567M', '27HIJKL4567M4S2', 'Amritsar, Punjab', ARRAY['Catering Services']),
('Ashok Venues', 'Imperial Banquets', 'ashok@imperialbanquets.com', '+91-9876540035', 44, 'Male', 'XXXX-XXXX-1035', 'IJKLM5678N', '27IJKLM5678N5R1', 'Vijayawada, Andhra Pradesh', ARRAY['Venue']),
('Pooja Decor', 'Elegant Touches', 'pooja@eleganttouches.com', '+91-9876540036', 28, 'Female', 'XXXX-XXXX-1036', 'JKLMN6789O', '27JKLMN6789O6Q0', 'Hubli, Karnataka', ARRAY['Decor and Styling']),
('Sanjay Music', 'Beat Box Entertainment', 'sanjay@beatbox.com', '+91-9876540037', 35, 'Male', 'XXXX-XXXX-1037', 'KLMNO7890P', '27KLMNO7890P7P9', 'Varanasi, Uttar Pradesh', ARRAY['Music, Anchors & Entertainment']),
('Meena Makeup', 'Glamour Studio', 'meena@glamourstudio.com', '+91-9876540038', 27, 'Female', 'XXXX-XXXX-1038', 'LMNOP8901Q', '27LMNOP8901Q8O8', 'Meerut, Uttar Pradesh', ARRAY['Personal Care and Grooming']),
('Pradeep Events', 'Memorable Moments', 'pradeep@memorablemoments.com', '+91-9876540039', 38, 'Male', 'XXXX-XXXX-1039', 'MNOPQ9012R', '27MNOPQ9012R9N7', 'Allahabad, Uttar Pradesh', ARRAY['Event Planner']),
('Bharti Rentals', 'Supreme Rentals', 'bharti@supremerentals.com', '+91-9876540040', 31, 'Female', 'XXXX-XXXX-1040', 'NOPQR0123S', '27NOPQR0123S0M6', 'Jamshedpur, Jharkhand', ARRAY['Rental Services']),
('Gopal Photo', 'Shutter Stories', 'gopal@shutterstories.com', '+91-9876540041', 33, 'Male', 'XXXX-XXXX-1041', 'OPQRS1234T', '27OPQRS1234T1L5', 'Gwalior, Madhya Pradesh', ARRAY['Photography & Videography']),
('Urmila Catering', 'Flavors Catering', 'urmila@flavorscatering.com', '+91-9876540042', 35, 'Female', 'XXXX-XXXX-1042', 'PQRST2345U', '27PQRST2345U2K4', 'Salem, Tamil Nadu', ARRAY['Catering Services']),
('Deepak Venues', 'Celebration Palace', 'deepak@celebrationpalace.com', '+91-9876540043', 45, 'Male', 'XXXX-XXXX-1043', 'QRSTU3456V', '27QRSTU3456V3J3', 'Udaipur, Rajasthan', ARRAY['Venue']),
('Shilpa Decor', 'Decorative Arts', 'shilpa@decorativearts.com', '+91-9876540044', 29, 'Female', 'XXXX-XXXX-1044', 'RSTUV4567W', '27RSTUV4567W4I2', 'Panipat, Haryana', ARRAY['Decor and Styling']),
('Ramesh Music', 'Music Maestros', 'ramesh@musicmaestros.com', '+91-9876540045', 36, 'Male', 'XXXX-XXXX-1045', 'STUVW5678X', '27STUVW5678X5H1', 'Bareilly, Uttar Pradesh', ARRAY['Music, Anchors & Entertainment']),
('Geeta Makeup', 'Beauty Excellence', 'geeta@beautyexcellence.com', '+91-9876540046', 26, 'Female', 'XXXX-XXXX-1046', 'TUVWX6789Y', '27TUVWX6789Y6G0', 'Moradabad, Uttar Pradesh', ARRAY['Personal Care and Grooming']),
('Vinod Events', 'Perfect Celebrations', 'vinod@perfectcelebrations.com', '+91-9876540047', 40, 'Male', 'XXXX-XXXX-1047', 'UVWXY7890Z', '27UVWXY7890Z7F9', 'Aligarh, Uttar Pradesh', ARRAY['Event Planner']),
('Radha Rentals', 'Quality Rentals', 'radha@qualityrentals.com', '+91-9876540048', 32, 'Female', 'XXXX-XXXX-1048', 'VWXYZ8901A', '27VWXYZ8901A8E8', 'Dhanbad, Jharkhand', ARRAY['Rental Services']),
('Sunil Photo', 'Frame Perfect', 'sunil@frameperfect.com', '+91-9876540049', 34, 'Male', 'XXXX-XXXX-1049', 'WXYZA9012B', '27WXYZA9012B9D7', 'Asansol, West Bengal', ARRAY['Photography & Videography']),
('Lata Catering', 'Delightful Dining', 'lata@delightfuldining.com', '+91-9876540050', 37, 'Female', 'XXXX-XXXX-1050', 'XYZAB0123C', '27XYZAB0123C0C6', 'Durgapur, West Bengal', ARRAY['Catering Services']);

-- Insert vendor details for some vendors
INSERT INTO public.vendor_details (vendor_id, question_com, no_of_images, review, subscription, overall_gr) 
SELECT 
    v.id,
    CASE 
        WHEN v.categories @> ARRAY['Photography & Videography'] THEN 'Professional photography services with modern equipment'
        WHEN v.categories @> ARRAY['Catering Services'] THEN 'Quality food services with diverse menu options'
        WHEN v.categories @> ARRAY['Venue'] THEN 'Premium venues with excellent facilities'
        WHEN v.categories @> ARRAY['Decor and Styling'] THEN 'Creative decoration services for all events'
        WHEN v.categories @> ARRAY['Music, Anchors & Entertainment'] THEN 'Professional entertainment and music services'
        WHEN v.categories @> ARRAY['Personal Care and Grooming'] THEN 'Expert makeup and grooming services'
        WHEN v.categories @> ARRAY['Event Planner'] THEN 'Complete event planning and management'
        ELSE 'Quality rental services for events'
    END,
    FLOOR(RANDOM() * 50) + 10,
    'Excellent service quality with satisfied customers',
    CASE WHEN RANDOM() < 0.3 THEN 'premium' WHEN RANDOM() < 0.7 THEN 'standard' ELSE 'basic' END,
    ROUND((RANDOM() * 1.5 + 3.5)::numeric, 2)
FROM public.vendors v
WHERE RANDOM() < 0.8
LIMIT 40;