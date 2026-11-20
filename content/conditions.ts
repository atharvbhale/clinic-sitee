/** DRAFT content. Not approved by Dr. Bhale. Pages stay noindex until reviewStatus is "approved". */
export interface Condition {
  slug: string; name: string; summary: string; who: string; redFlags: string[];
  faqs: { q: string; a: string }[]; reviewStatus: "pending" | "approved"; reviewedOn?: string;
}
export const conditions: Condition[] = [
  { slug: "skin", name: "Skin concerns", reviewStatus: "pending",
    summary: "Skin concerns cover a wide range of problems, such as itching, rashes, dryness, acne or patchy changes. Causes vary, so a proper assessment matters.",
    who: "People of any age can be affected, and skin problems can be linked to allergies, infections, stress or other health conditions.",
    redFlags: ["A rash that spreads quickly, especially with fever", "Swelling of the face, lips or tongue, or trouble breathing", "Signs of infection: pus, spreading redness, severe pain", "Blistering, or a mole that changes in size, shape or colour"],
    faqs: [{ q: "Should I stop my current skin treatment?", a: "No. Do not stop or change prescribed medicines without speaking to the doctor who prescribed them." }, { q: "Do I need to bring anything?", a: "Bring previous reports and a list of current medicines and creams." }] },
  { slug: "allergies", name: "Allergies", reviewStatus: "pending",
    summary: "An allergy is an overreaction of the body to something usually harmless, such as dust, pollen, foods or medicines. Symptoms can include sneezing, itching, rashes or digestive upset.",
    who: "Allergies can begin at any age and often run in families.",
    redFlags: ["Difficulty breathing or wheezing", "Swelling of the lips, tongue or throat", "Widespread hives with dizziness or fainting", "Any severe reaction after a food, insect sting or medicine: this is an emergency, call 112"],
    faqs: [{ q: "Can homeopathy treat a severe allergic reaction?", a: "No. Severe reactions need emergency medical care. Homeopathic consultation is not a substitute for it." }, { q: "Should I stop my allergy medicines?", a: "No. Do not stop prescribed medicines or emergency medication without medical advice." }] },
  { slug: "digestive-concerns", name: "Digestive concerns", reviewStatus: "pending",
    summary: "Digestive concerns include acidity, bloating, constipation, loose motions and stomach discomfort. They often relate to food, routine, stress or infection.",
    who: "Anyone can be affected. Long-lasting or recurring symptoms deserve a proper evaluation.",
    redFlags: ["Blood in vomit or stool, or black stool", "Severe or persistent abdominal pain", "Unexplained weight loss", "Persistent vomiting, signs of dehydration, or yellowing of the skin or eyes", "Difficulty swallowing"],
    faqs: [{ q: "Do I need tests first?", a: "Some symptoms need tests or a conventional evaluation. The doctor will advise you at the consultation." }] },
  { slug: "respiratory-concerns", name: "Respiratory concerns", reviewStatus: "pending",
    summary: "Respiratory concerns include cough, cold, sinus trouble, wheeze and breathlessness. Triggers include infections, allergies, dust and smoke.",
    who: "All ages can be affected. Children and older adults need particular care.",
    redFlags: ["Breathlessness at rest or difficulty speaking", "Blue or grey lips", "Chest pain or coughing blood", "High fever that persists", "Wheeze not relieved by your prescribed inhaler"],
    faqs: [{ q: "I use an inhaler. Can I stop it?", a: "No. Never stop prescribed inhalers or asthma medicines without medical advice." }] },
  { slug: "joint-pains", name: "Joint pains", reviewStatus: "pending",
    summary: "Joint pain can come from wear and tear, injury, inflammation or other conditions. It may affect movement, sleep and daily activity.",
    who: "More common with age, but also affects younger people after injury or with inflammatory conditions.",
    redFlags: ["A hot, swollen joint with fever", "Injury with visible deformity or inability to bear weight", "Numbness, weakness or loss of bladder or bowel control", "Chest pain with arm or jaw pain", "Unexplained weight loss with joint pain"],
    faqs: [{ q: "Can I continue my pain medicines?", a: "Yes, unless the doctor who prescribed them advises otherwise. Do not stop prescribed medicines on your own." }] },
  { slug: "paediatric-concerns", name: "Common paediatric concerns", reviewStatus: "pending",
    summary: "Children often get coughs, colds, tummy upsets, skin problems and fevers. Most are mild, but children can become unwell quickly.",
    who: "Infants, toddlers and school-age children. Parents should always watch for warning signs.",
    redFlags: ["Fever in a baby under 3 months", "Fast or difficult breathing", "Signs of dehydration: very dry mouth, no urine for many hours", "Unusual drowsiness, unresponsiveness or a seizure", "A rash that does not fade when pressed, or persistent vomiting"],
    faqs: [{ q: "Is it safe to skip my child's vaccinations?", a: "Please follow your paediatrician's vaccination advice. The clinic does not advise skipping routine vaccination." }] },
];
export const getCondition = (slug: string) => conditions.find((c) => c.slug === slug);
