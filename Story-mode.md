# Story Mode Implementation Guide

## Overview
The story mode feature transforms traditional learning into an immersive, narrative-driven experience. Learners progress through educational content presented as a cohesive story with quests, challenges, and rewards.

## Tech Stack & Architecture

### Backend Components
- **Flask**: Core backend framework
- **SQLite**: Database for story progression and user state
- **SQLAlchemy**: ORM for database interactions
- **Flask-SocketIO**: Real-time updates for story progression

### Frontend Components
- **React**: UI framework for interactive elements
- **React Router**: Navigation between story chapters
- **Redux**: State management for story progress and user choices
- **Framer Motion**: Animations for transitions and effects
- **React Three Fiber**: 3D elements for immersive scenes (optional)
- **Howler.js**: Sound effects and background music
- **Styled Components**: Consistent theming across story elements

### Integration Components
- **Gemini API**: Dynamic story generation and adaptation
- **Local Storage**: Saving progress between sessions
- **IndexedDB**: Caching story assets for offline access

## Database Schema

```sql
-- Story structure tables
CREATE TABLE story_worlds (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    difficulty_level INTEGER
);

CREATE TABLE story_chapters (
    id INTEGER PRIMARY KEY,
    world_id INTEGER REFERENCES story_worlds(id),
    title TEXT NOT NULL,
    description TEXT,
    order_number INTEGER,
    unlock_requirements TEXT
);

CREATE TABLE story_quests (
    id INTEGER PRIMARY KEY,
    chapter_id INTEGER REFERENCES story_chapters(id),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT,
    content_id INTEGER,
    xp_reward INTEGER,
    coin_reward INTEGER,
    order_number INTEGER
);

CREATE TABLE story_choices (
    id INTEGER PRIMARY KEY,
    quest_id INTEGER REFERENCES story_quests(id),
    text TEXT NOT NULL,
    consequence_description TEXT,
    next_quest_id INTEGER REFERENCES story_quests(id),
    required_items TEXT
);

-- User progress tracking
CREATE TABLE user_story_progress (
    user_id INTEGER REFERENCES users(id),
    world_id INTEGER REFERENCES story_worlds(id),
    chapter_id INTEGER REFERENCES story_chapters(id),
    quest_id INTEGER REFERENCES story_quests(id),
    completed_quests TEXT,
    choices_made TEXT,
    items_collected TEXT,
    current_xp INTEGER,
    last_checkpoint TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, world_id)
);

-- Story elements
CREATE TABLE story_characters (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    role TEXT
);

CREATE TABLE story_items (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    effect TEXT
);
```

## Implementation Steps

### 1. Story Engine Core

#### Backend Implementation
```python
# app/models/story.py
from app import db
from datetime import datetime

class StoryWorld(db.Model):
    __tablename__ = 'story_worlds'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    cover_image = db.Column(db.String(255))
    difficulty_level = db.Column(db.Integer, default=1)
    chapters = db.relationship('StoryChapter', backref='world', lazy=True)

class StoryChapter(db.Model):
    __tablename__ = 'story_chapters'
    id = db.Column(db.Integer, primary_key=True)
    world_id = db.Column(db.Integer, db.ForeignKey('story_worlds.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    order_number = db.Column(db.Integer, nullable=False)
    unlock_requirements = db.Column(db.Text)
    quests = db.relationship('StoryQuest', backref='chapter', lazy=True)

# Add other models for quest, choice, progress, etc.

# app/routes/story_routes.py
from flask import Blueprint, jsonify, request
from app.models.story import StoryWorld, StoryChapter, StoryQuest, UserStoryProgress
from app import db

story_bp = Blueprint('story', __name__, url_prefix='/api/story')

@story_bp.route('/worlds', methods=['GET'])
def get_story_worlds():
    worlds = StoryWorld.query.all()
    return jsonify([{
        'id': world.id,
        'title': world.title,
        'description': world.description,
        'cover_image': world.cover_image,
        'difficulty_level': world.difficulty_level
    } for world in worlds])

@story_bp.route('/worlds/<int:world_id>/chapters', methods=['GET'])
def get_chapters(world_id):
    chapters = StoryChapter.query.filter_by(world_id=world_id).order_by(StoryChapter.order_number).all()
    return jsonify([{
        'id': chapter.id,
        'title': chapter.title,
        'description': chapter.description,
        'order_number': chapter.order_number,
        'unlock_requirements': chapter.unlock_requirements
    } for chapter in chapters])

# Add routes for quests, progress tracking, etc.
```

#### Frontend Implementation
```jsx
// src/components/StoryMode/StoryWorld.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const StoryWorld = () => {
  const [world, setWorld] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { worldId } = useParams();

  useEffect(() => {
    const fetchWorldData = async () => {
      try {
        const worldResponse = await axios.get(`/api/story/worlds/${worldId}`);
        const chaptersResponse = await axios.get(`/api/story/worlds/${worldId}/chapters`);
        
        setWorld(worldResponse.data);
        setChapters(chaptersResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching story world:', error);
        setLoading(false);
      }
    };

    fetchWorldData();
  }, [worldId]);

  if (loading) {
    return <div className="loading-spinner">Loading adventure...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="story-world-container"
    >
      <div className="story-world-header">
        <h1>{world.title}</h1>
        <p>{world.description}</p>
      </div>
      
      <div className="story-chapters-map">
        {chapters.map((chapter) => (
          <motion.div
            key={chapter.id}
            whileHover={{ scale: 1.05 }}
            className="story-chapter-node"
          >
            <Link to={`/story/${worldId}/chapter/${chapter.id}`}>
              <h3>{chapter.title}</h3>
              <p>{chapter.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StoryWorld;
```

### 2. Story Quest System

#### Backend Implementation
```python
# app/story_engine/quest_handler.py
class QuestHandler:
    def __init__(self, user_id, quest_id):
        self.user_id = user_id
        self.quest_id = quest_id
        self.quest = StoryQuest.query.get(quest_id)
        self.user_progress = UserStoryProgress.query.filter_by(
            user_id=user_id, 
            world_id=self.quest.chapter.world_id
        ).first()
    
    def start_quest(self):
        # Logic to start a quest
        pass
    
    def complete_quest(self, choice_id=None):
        # Logic to complete a quest
        # Update user progress
        # Award XP and coins
        pass
    
    def get_next_quest(self, choice_id=None):
        # Logic to determine next quest based on user choices
        pass
```

#### Frontend Implementation
```jsx
// src/components/StoryMode/QuestPlayer.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Howl } from 'howler';

const QuestPlayer = () => {
  const [quest, setQuest] = useState(null);
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animation, setAnimation] = useState('idle');
  const { questId } = useParams();
  const navigate = useNavigate();
  
  // Sound effects
  const sounds = {
    questStart: new Howl({ src: ['/sounds/quest-start.mp3'] }),
    questComplete: new Howl({ src: ['/sounds/quest-complete.mp3'] }),
    choiceMade: new Howl({ src: ['/sounds/choice-made.mp3'] })
  };

  useEffect(() => {
    const fetchQuestData = async () => {
      try {
        const questResponse = await axios.get(`/api/story/quests/${questId}`);
        const choicesResponse = await axios.get(`/api/story/quests/${questId}/choices`);
        
        setQuest(questResponse.data);
        setChoices(choicesResponse.data);
        setLoading(false);
        
        sounds.questStart.play();
      } catch (error) {
        console.error('Error fetching quest data:', error);
        setLoading(false);
      }
    };

    fetchQuestData();
  }, [questId]);

  const handleChoiceSelect = async (choiceId) => {
    try {
      sounds.choiceMade.play();
      setAnimation('choosing');
      
      const response = await axios.post(`/api/story/quests/${questId}/complete`, {
        choice_id: choiceId
      });
      
      setTimeout(() => {
        sounds.questComplete.play();
        setAnimation('complete');
        
        // Navigate to next quest after animation
        setTimeout(() => {
          navigate(`/story/quest/${response.data.next_quest_id}`);
        }, 1500);
      }, 1000);
    } catch (error) {
      console.error('Error processing choice:', error);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading quest...</div>;
  }

  return (
    <div className="quest-player">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="quest-content"
      >
        <h2>{quest.title}</h2>
        <div className="quest-description">{quest.description}</div>
        
        {/* Quest content based on type (text, video, quiz, etc.) */}
        {quest.type === 'text' && (
          <div className="quest-text-content">{quest.content}</div>
        )}
        {/* Add other quest content types */}
      </motion.div>
      
      <AnimatePresence>
        {animation === 'idle' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="quest-choices"
          >
            {choices.map((choice) => (
              <motion.button
                key={choice.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleChoiceSelect(choice.id)}
                className="quest-choice-btn"
              >
                {choice.text}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestPlayer;
```

### 3. Story World Builder (Admin Tool)

```jsx
// src/admin/components/StoryBuilder/WorldBuilder.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const WorldBuilder = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/admin/story/worlds', data);
      setMessage('Story world created successfully!');
    } catch (error) {
      setMessage('Error creating story world.');
      console.error(error);
    }
  };

  return (
    <div className="world-builder">
      <h2>Create New Story World</h2>
      
      {message && <div className="message">{message}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Title</label>
          <input 
            {...register('title', { required: 'Title is required' })}
            className="form-control"
          />
          {errors.title && <span className="error">{errors.title.message}</span>}
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea 
            {...register('description')}
            className="form-control"
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label>Cover Image URL</label>
          <input 
            {...register('cover_image')}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label>Difficulty Level (1-5)</label>
          <input 
            type="number"
            {...register('difficulty_level', { min: 1, max: 5 })}
            className="form-control"
            defaultValue={1}
          />
        </div>
        
        <button type="submit" className="btn btn-primary">Create World</button>
      </form>
    </div>
  );
};

export default WorldBuilder;
```

## Integration with Learning Content

### 1. Map Courses to Story Worlds

```python
# app/models/story_course_mapping.py
from app import db

class StoryCourseMapping(db.Model):
    __tablename__ = 'story_course_mappings'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    story_world_id = db.Column(db.Integer, db.ForeignKey('story_worlds.id'), nullable=False)
    
    # Define relationships
    course = db.relationship('Course', backref='story_mappings')
    story_world = db.relationship('StoryWorld', backref='course_mappings')
```

### 2. Map Lessons to Quests

```python
# app/models/story_lesson_mapping.py
from app import db

class StoryLessonMapping(db.Model):
    __tablename__ = 'story_lesson_mappings'
    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id'), nullable=False)
    story_quest_id = db.Column(db.Integer, db.ForeignKey('story_quests.id'), nullable=False)
    
    # Define relationships
    lesson = db.relationship('Lesson', backref='story_mappings')
    story_quest = db.relationship('StoryQuest', backref='lesson_mappings')
```

## AI Integration for Dynamic Storytelling

```python
# app/story_engine/ai_generator.py
import google.generativeai as genai
from flask import current_app
from app.models.story import StoryQuest, StoryChoice

class StoryAIGenerator:
    def __init__(self):
        api_key = current_app.config['GENAI_API_KEY']
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def generate_quest_narrative(self, course_topic, lesson_content, character_type):
        prompt = f"""
        Create an engaging educational quest narrative for a course on {course_topic}.
        The educational content is: {lesson_content}
        The main character is a {character_type}.
        
        The narrative should:
        1. Be engaging and immersive
        2. Incorporate the educational content naturally
        3. Include 2-3 key learning objectives
        4. End with a challenge or question
        5. Provide 2-3 possible choices for the learner
        
        Format the response as a JSON object with:
        - title: The quest title
        - narrative: The quest story
        - choices: Array of objects with "text" and "consequence" fields
        """
        
        response = self.model.generate_content(prompt)
        return response.text
    
    def create_quest_from_ai(self, chapter_id, course_topic, lesson_content, character_type):
        # Generate quest narrative from AI
        narrative_json = self.generate_quest_narrative(course_topic, lesson_content, character_type)
        
        # Parse the JSON response
        # Create a new quest in the database
        # Create choices for the quest
        # Return the created quest
        pass
```

## Gamification Integration

```python
# app/story_engine/reward_system.py
from app.models.user import User
from app.models.story import UserStoryProgress
from app import db

class StoryRewardSystem:
    def __init__(self, user_id):
        self.user_id = user_id
        self.user = User.query.get(user_id)
    
    def award_quest_completion(self, quest_id):
        quest = StoryQuest.query.get(quest_id)
        
        # Award XP
        self.user.experience_points += quest.xp_reward
        
        # Award coins
        self.user.learn_coins += quest.coin_reward
        
        # Check for level up
        self._check_level_up()
        
        # Check for badges
        self._check_badges()
        
        # Save changes
        db.session.commit()
        
        return {
            'xp_gained': quest.xp_reward,
            'coins_gained': quest.coin_reward,
            'new_level': self.user.level,
            'new_badges': []  # Populate with any new badges earned
        }
    
    def _check_level_up(self):
        # Logic to check if user levels up based on XP
        pass
    
    def _check_badges(self):
        # Logic to check if user earns any new badges
        pass
```

## Mobile and Responsive Design

```jsx
// src/components/StoryMode/ResponsiveStoryPlayer.jsx
import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';

const ResponsiveStoryPlayer = ({ quest, choices, onChoiceSelect }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  return (
    <div className={`story-player ${isMobile ? 'mobile-view' : 'desktop-view'}`}>
      {isMobile ? (
        <MobileStoryView quest={quest} choices={choices} onChoiceSelect={onChoiceSelect} />
      ) : (
        <DesktopStoryView quest={quest} choices={choices} onChoiceSelect={onChoiceSelect} />
      )}
    </div>
  );
};

const MobileStoryView = ({ quest, choices, onChoiceSelect }) => {
  // Mobile-specific layout
  return (
    <div className="mobile-story-container">
      <div className="story-content">
        <h2>{quest.title}</h2>
        <div className="quest-text">{quest.description}</div>
      </div>
      
      <div className="mobile-choices">
        {choices.map(choice => (
          <button 
            key={choice.id}
            className="mobile-choice-btn"
            onClick={() => onChoiceSelect(choice.id)}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
};

const DesktopStoryView = ({ quest, choices, onChoiceSelect }) => {
  // Desktop-specific layout with more space and features
  return (
    <div className="desktop-story-container">
      <div className="story-sidebar">
        <div className="quest-info">
          <h3>Current Quest</h3>
          <h2>{quest.title}</h2>
        </div>
        <div className="quest-progress">
          {/* Progress indicators */}
        </div>
      </div>
      
      <div className="story-main-content">
        <div className="quest-description">{quest.description}</div>
        
        <div className="quest-choices">
          {choices.map(choice => (
            <motion.button
              key={choice.id}
              className="desktop-choice-btn"
              whileHover={{ scale: 1.05 }}
              onClick={() => onChoiceSelect(choice.id)}
            >
              {choice.text}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveStoryPlayer;
```

## Offline Support

```javascript
// src/service-worker.js
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache all the webpack injected assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache story assets with a cache-first strategy
registerRoute(
  ({ request }) => request.destination === 'image' && request.url.includes('/story-assets/'),
  new CacheFirst({
    cacheName: 'story-images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache story data with a network-first strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/story/'),
  new NetworkFirst({
    cacheName: 'story-data',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
);
```

## Performance Optimization

```javascript
// src/components/StoryMode/LazyLoadedStoryAssets.jsx
import React, { Suspense, lazy } from 'react';
import { useInView } from 'react-intersection-observer';

// Lazy load components
const StoryBackground = lazy(() => import('./StoryBackground'));
const StoryCharacter = lazy(() => import('./StoryCharacter'));
const StoryEffects = lazy(() => import('./StoryEffects'));

const LazyLoadedStoryAssets = ({ sceneData }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="story-scene">
      {inView && (
        <Suspense fallback={<div className="loading-scene">Loading scene...</div>}>
          <StoryBackground scene={sceneData.background} />
          <StoryCharacter character={sceneData.character} />
          <StoryEffects effects={sceneData.effects} />
        </Suspense>
      )}
    </div>
  );
};

export default LazyLoadedStoryAssets;
```

## Accessibility Considerations

```jsx
// src/components/StoryMode/AccessibleStoryPlayer.jsx
import React, { useRef, useEffect } from 'react';
import { useA11y } from '../../hooks/useA11y';

const AccessibleStoryPlayer = ({ quest, choices, onChoiceSelect }) => {
  const { a11yPreferences } = useA11y();
  const mainContentRef = useRef(null);
  
  // Focus on main content when quest changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.focus();
    }
  }, [quest.id]);
  
  return (
    <div 
      className={`story-player ${a11yPreferences.highContrast ? 'high-contrast' : ''}`}
      style={{ fontSize: `${a11yPreferences.fontSize}px` }}
    >
      <div 
        ref={mainContentRef}
        tabIndex="-1"
        className="story-content"
        aria-live="polite"
      >
        <h2>{quest.title}</h2>
        <div className="quest-description">{quest.description}</div>
        
        {a11yPreferences.screenReader && (
          <div className="sr-only">
            You have {choices.length} choices available.
          </div>
        )}
      </div>
      
      <div className="story-choices" role="menu">
        {choices.map((choice, index) => (
          <button
            key={choice.id}
            className="choice-btn"
            onClick={() => onChoiceSelect(choice.id)}
            aria-keyshortcuts={`${index + 1}`}
            role="menuitem"
          >
            {a11yPreferences.showShortcuts && <span className="shortcut">{index + 1}.</span>}
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccessibleStoryPlayer;
```

## Analytics Integration

```javascript
// src/services/storyAnalytics.js
class StoryAnalytics {
  trackQuestStart(questId, userId) {
    this._trackEvent('quest_start', {
      quest_id: questId,
      user_id: userId,
      timestamp: new Date().toISOString()
    });
  }
  
  trackQuestComplete(questId, userId, timeSpent, choiceId) {
    this._trackEvent('quest_complete', {
      quest_id: questId,
      user_id: userId,
      time_spent: timeSpent,
      choice_id: choiceId,
      timestamp: new Date().toISOString()
    });
  }
  
  trackStoryProgress(userId, worldId, completionPercentage) {
    this._trackEvent('story_progress', {
      user_id: userId,
      world_id: worldId,
      completion_percentage: completionPercentage,
      timestamp: new Date().toISOString()
    });
  }
  
  _trackEvent(eventName, data) {
    // Send to backend analytics endpoint
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event: eventName,
        data: data
      })
    }).catch(err => console.error('Analytics error:', err));
  }
}

export default new StoryAnalytics();
```

## Putting It All Together

With all these components, you can create a comprehensive story mode learning experience. Here's a high-level overview of how they connect:

1. **Story Creation**: Admin creates story worlds with chapters and quests
2. **Content Mapping**: Educational content is mapped to story elements
3. **User Journey**: Users select a story world and progress through quests
4. **Progress Tracking**: System tracks user progress and awards rewards
5. **AI Enhancement**: Gemini API generates dynamic narrative content
6. **Gamification**: XP, coins, and badges incentivize progress

This implementation provides a flexible, extensible framework for story-based learning that can be customized to fit various educational domains and content types.
