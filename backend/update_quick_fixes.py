"""Script to add bilingual content to quick fixes."""
import json
from pathlib import Path

# Load quick fixes
path = Path(__file__).parent / "app" / "data" / "quick_fixes.json"
with open(path, 'r', encoding='utf-8') as f:
    fixes = json.load(f)

# English translations for what_to_say based on topic
english_phrases = {
    'Counting': ['Let\'s count together', 'Show your fingers', 'One, two, three...'],
    'Addition': ['Let\'s learn addition with stones', 'Put two stones and three stones together', 'How many total?'],
    'Attention': ['Everyone stand up!', 'Let\'s sing Head, Shoulders, Knees, Toes', 'Clap your hands!'],
    'Reading Comprehension': ['Look at the picture first', 'What do you think will happen?', 'Let\'s read together'],
    'Subtraction': ['When we have less in ones, we borrow from tens', 'Open one bundle', 'Now subtract'],
    'Alphabet': ['Let\'s sing the alphabet song', 'Write in the air', 'Trace with your finger'],
    'Multiplication': ['Clap while saying tables', 'Sing the 2 times table', 'Practice together'],
    'Letter Recognition': ['B has a belly, Bh has a dot', 'Make letters in clay', 'Feel the shape'],
    'Word Problems': ['What is happening in the problem? Act it out', 'Draw a picture', 'Find keywords'],
    'Fractions': ['Divide the roti into equal parts', 'Fold paper in half', 'Share equally'],
    'Writing': ['First write in air', 'Do finger exercises', 'Practice slowly'],
    'Place Value': ['Ones, Tens, Hundreds - three houses', 'Make bundles of sticks', 'Count carefully'],
    'Matra': ['This is how the aa matra comes', 'Show matra with colors', 'Practice together'],
    'Speaking': ['Say Good morning', 'Very good! Try again', 'Repeat after me'],
    'Time': ['The short hand shows hours', 'Make your own clock', 'What time is it?'],
    'Participation': ['Talk to your partner', 'Who will tell?', 'Think, pair, share'],
    'Shapes': ['Find round things in the room', 'Make a triangle with your body', 'Look around'],
    'Poetry': ['Say it while moving hands', 'Repeat after me', 'Let\'s recite together'],
    'Measurement': ['Measure with your handspan', 'Count the room length in steps', 'Compare sizes'],
    'Environment': ['Let\'s go outside and look', 'What do you see in your village?', 'Observe nature'],
    'Division': ['Divide 12 candies among 4 children', 'Share equally', 'How many each?'],
    'Sentence Formation': ['Look at picture and speak', 'Start with I...', 'Make a sentence'],
    'Number Recognition': ['Which number is this?', 'Write in sand', 'Match the cards'],
    'Phonics': ['K for Kite', 'Listen to the sound and say', 'What letter makes this sound?'],
    'Data Handling': ['Do a survey in class', 'How many children like apples?', 'Count and record'],
    'Story Retelling': ['What happened first? Then what?', 'Arrange pictures in order', 'Tell the story'],
    'Money': ['Let\'s play shop', 'How much change will you get?', 'Count the money'],
    'Handwriting': ['Write slowly', 'Where does the letter sit on four lines?', 'Practice neatly'],
    'Geometry': ['Where do you see angles?', 'Look at the word wall', 'Find shapes around you'],
    'Grammar': ['Look at examples first', 'What pattern do you see?', 'Practice the rule'],
    'Skip Counting': ['Count by 2s', 'Jump and say', 'Follow the pattern'],
    'Vocabulary': ['What is today\'s word?', 'Use it in a sentence', 'Remember and practice'],
    'Patterns': ['What comes next?', 'Make a clap-tap pattern', 'Find the pattern'],
    'Compound Words': ['Two words become one', 'Break it apart', 'Combine words'],
    'Area Perimeter': ['Fencing = Perimeter', 'Carpet = Area', 'Calculate both'],  
    'Punctuation': ['Stop at full stop', 'Voice goes up for question', 'Read with expression'],
    'Mental Math': ['Make pairs that equal 10', 'Say quickly', 'Practice daily'],
    'Paragraph Writing': ['Write main idea first', 'Add three supporting details', 'Conclude well'],
    'Volume': ['How much water can it hold?', 'Build with cubes and count', 'Measure capacity'],
    'Values': ['Listen to the story and tell what you learned', 'What would you do?', 'Discuss together'],
    'Decimals': ['Think of rupees and paise', 'After the dot are paise', 'Practice with money'],
    'Letter Formation': ['Start from the dot', 'Write in 1-2-3 order', 'Trace carefully'],
    'Comparing Numbers': ['Crocodile eats the bigger one', 'Look at tens first', 'Compare digits'],
    'Listening': ['Listen carefully', 'Draw what you hear', 'Pay attention'],
    'Symmetry': ['Fold in half, both sides same', 'Draw the middle line of body', 'Mirror image'],
    'Dictionary': ['Arrange in alphabet order', 'Look at guide words', 'Find quickly'],
    'Odd Even': ['If pairs form, it\'s even', '0,2,4,6,8 endings are even', 'Check last digit'],
    'Creative Writing': ['If you were a bird...', 'Write a story about the picture', 'Use imagination'],
    'Calendar': ['What day is today?', 'Find your birthday', 'Count the days'],
    'Classroom Management': ['When I clap, everyone quiet', 'Voice level 1 please', 'Follow the signal']
}

# Default phrases
default_en = ['Let\'s learn together', 'Watch and listen', 'Practice carefully', 'Very good!']

# Update each fix with bilingual content
for fix in fixes:
    topic = fix.get('topic', '')
    
    # Add English what_to_say
    if 'what_to_say_en' not in fix or fix['what_to_say_en'] is None:
        fix['what_to_say_en'] = english_phrases.get(topic, default_en)
    
    # Add Hindi what_to_say from default
    if 'what_to_say_hi' not in fix or fix['what_to_say_hi'] is None:
        fix['what_to_say_hi'] = fix.get('what_to_say', [])
    
    # Add English problem
    if 'problem_en' not in fix or fix['problem_en'] is None:
        fix['problem_en'] = f'{topic} issue'
    
    # Add Hindi problem
    if 'problem_hi' not in fix or fix['problem_hi'] is None:
        fix['problem_hi'] = fix.get('problem', '')
    
    # Add activity translations
    activity = fix.get('activity', 'Interactive Activity')
    if 'activity_en' not in fix or fix['activity_en'] is None:
        fix['activity_en'] = activity
    if 'activity_hi' not in fix or fix['activity_hi'] is None:
        fix['activity_hi'] = activity

# Save updated fixes
with open(path, 'w', encoding='utf-8') as f:
    json.dump(fixes, f, ensure_ascii=False, indent=2)

print(f'Updated {len(fixes)} quick fixes with bilingual content!')

# Verify Fractions topic
for fix in fixes:
    if fix.get('topic') == 'Fractions':
        print(f"Fractions what_to_say_en: {fix['what_to_say_en']}")
        print(f"Fractions what_to_say_hi: {fix['what_to_say_hi']}")
        break
