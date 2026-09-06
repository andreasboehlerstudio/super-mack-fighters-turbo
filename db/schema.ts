import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const highscores=sqliteTable('highscores',{
 id:text('id').primaryKey(),initials:text('initials').notNull(),hero:text('hero').notNull(),score:integer('score').notNull(),tour:text('tour').notNull(),created:integer('created').notNull(),
},t=>[index('highscores_ranking').on(t.tour,t.score)]);
export const rooms=sqliteTable('rooms',{
 code:text('code').primaryKey(),token:text('token').notNull(),offer:text('offer').notNull(),answer:text('answer'),config:text('config').notNull(),expires:integer('expires').notNull(),
},t=>[index('rooms_expiry').on(t.expires)]);
