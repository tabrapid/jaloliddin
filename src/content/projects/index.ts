import type { ProjectRecord } from "@/types/content";

import { bloodchain } from "./bloodchain";
import { schoolPlatform } from "./school-platform";

/**
 * Register projects here. Adding a project = adding one record file and one
 * line below; the index page, detail page, sitemap and metadata pick it up.
 */
export const projectRecords: ProjectRecord[] = [bloodchain, schoolPlatform];
