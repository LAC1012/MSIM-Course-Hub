export type Course = {
  course_id: string;
  course_title: string;
  credits?: string;
  description?: string;
  course_type?: string;
  specialization?: string[];
  prerequisites?: string[];
};

export type Review = Record<string, unknown>;

export type SearchResult = {
  course: Course;
  review_count: number;
  reviews: Review[];
};

export type CourseDetailResponse = {
  course: Course;
  review_count: number;
  reviews: Review[];
};

