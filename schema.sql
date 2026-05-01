-- ==========================================
-- DHAKA CHRONICLES - SUPABASE SCHEMA
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('founder', 'admin', 'publisher');
CREATE TYPE article_status AS ENUM ('draft', 'review', 'published');
CREATE TYPE article_type AS ENUM ('news', 'opinion', 'feature', 'interview', 'photo_essay', 'video');

-- 2. USERS TABLE (Extends Supabase Auth)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role user_role DEFAULT 'publisher',
  password_hash TEXT,
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT,
  bio TEXT,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES TABLE
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#00A651',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ARTICLES TABLE
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content JSONB NOT NULL, -- TipTap JSON content
  status article_status DEFAULT 'draft',
  article_type article_type DEFAULT 'news',
  is_breaking BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  featured_image_url TEXT,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  views_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MEDIA LIBRARY
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INDEXES FOR PERFORMANCE
CREATE INDEX idx_articles_status ON public.articles(status);
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX idx_articles_category ON public.articles(category_id);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view published articles" 
  ON public.articles FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Public can view categories" 
  ON public.categories FOR SELECT 
  USING (true);

CREATE POLICY "Public can view authors" 
  ON public.users FOR SELECT 
  USING (true);

-- Admin & Founder full access
CREATE POLICY "Admins have full access to articles" 
  ON public.articles FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('founder', 'admin')));

-- Publisher access (can create, edit own, cannot delete)
CREATE POLICY "Publishers can insert articles" 
  ON public.articles FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT id FROM public.users WHERE role = 'publisher'));

CREATE POLICY "Publishers can update own articles" 
  ON public.articles FOR UPDATE 
  USING (author_id = auth.uid());

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_articles_modtime BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- 8. FACEBOOK IMPORTED POSTS
CREATE TYPE import_status AS ENUM ('pending', 'imported', 'skipped', 'failed');

CREATE TABLE public.facebook_imported_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facebook_post_id TEXT UNIQUE NOT NULL,
  message TEXT,
  link TEXT,
  image_url TEXT,
  video_url TEXT,
  post_type TEXT,
  created_time TIMESTAMPTZ,
  import_status import_status DEFAULT 'pending',
  article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fb_posts_status ON public.facebook_imported_posts(import_status);
CREATE TRIGGER update_fb_posts_modtime BEFORE UPDATE ON public.facebook_imported_posts FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- 9. LIVE BLOGS
CREATE TABLE public.live_blog_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_live_blog_modtime BEFORE UPDATE ON public.live_blog_updates FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- 10. PODCASTS
CREATE TABLE public.podcast_series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.podcast_episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  series_id UUID REFERENCES public.podcast_series(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_podcast_series_modtime BEFORE UPDATE ON public.podcast_series FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_podcast_episodes_modtime BEFORE UPDATE ON public.podcast_episodes FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- 11. NEWSLETTER SUBSCRIBERS
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active',
  language TEXT DEFAULT 'en',
  frequency TEXT DEFAULT 'weekly',
  subscribe_source TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. STORY ASSIGNMENTS
CREATE TYPE assignment_status AS ENUM ('proposed', 'assigned', 'in_progress', 'completed', 'cancelled');

CREATE TABLE public.story_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  assigned_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  deadline TIMESTAMPTZ,
  status assignment_status DEFAULT 'assigned',
  priority INTEGER DEFAULT 2, -- 1: High, 2: Medium, 3: Low
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_story_assignments_modtime BEFORE UPDATE ON public.story_assignments FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- 13. EDITORIAL NOTES (Internal comments on articles)
CREATE TABLE public.editorial_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. PORTFOLIO ITEMS
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  outcome TEXT,
  logo_url TEXT,
  featured_image_url TEXT,
  external_link TEXT,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_portfolio_modtime BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- RLS FOR PORTFOLIO
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published portfolio items" 
  ON public.portfolio_items FOR SELECT 
  USING (is_published = true);

CREATE POLICY "Admins have full access to portfolio items" 
  ON public.portfolio_items FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('founder', 'admin')));

-- FINAL RLS FOR REMAINING TABLES
ALTER TABLE public.facebook_imported_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_blog_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcast_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcast_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_notes ENABLE ROW LEVEL SECURITY;

-- 1. Facebook Imported Posts (Admins/Publishers only)
CREATE POLICY "Staff can manage facebook imports" 
  ON public.facebook_imported_posts FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('founder', 'admin', 'publisher')));

-- 2. Live Blog Updates (Public read, Staff write)
CREATE POLICY "Public can view live blog updates" 
  ON public.live_blog_updates FOR SELECT 
  USING (true);

CREATE POLICY "Staff can manage live blog updates" 
  ON public.live_blog_updates FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('founder', 'admin', 'publisher')));

-- 3. Podcasts (Public read, Staff write)
CREATE POLICY "Public can view podcasts" 
  ON public.podcast_series FOR SELECT USING (true);
CREATE POLICY "Public can view podcast episodes" 
  ON public.podcast_episodes FOR SELECT USING (published_at IS NOT NULL AND published_at <= NOW());

CREATE POLICY "Staff can manage podcasts" 
  ON public.podcast_series FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('founder', 'admin', 'publisher')));
CREATE POLICY "Staff can manage podcast episodes" 
  ON public.podcast_episodes FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('founder', 'admin', 'publisher')));

-- 4. Newsletter Subscribers (Admins only for list view, insert open to public if using service role)
CREATE POLICY "Admins can view subscribers" 
  ON public.newsletter_subscribers FOR SELECT 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('founder', 'admin')));

-- 5. Story Assignments (Staff only)
CREATE POLICY "Staff can view assignments" 
  ON public.story_assignments FOR SELECT 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('founder', 'admin', 'publisher')));
CREATE POLICY "Admins can manage assignments" 
  ON public.story_assignments FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('founder', 'admin')));

-- 6. Editorial Notes (Staff only)
CREATE POLICY "Staff can manage editorial notes" 
  ON public.editorial_notes FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('founder', 'admin', 'publisher')));

