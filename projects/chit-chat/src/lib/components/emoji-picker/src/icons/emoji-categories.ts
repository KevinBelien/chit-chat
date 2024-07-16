import { EmojiCategory } from '../interfaces';

export const emojiCategoryIcons: {
	[key in EmojiCategory]: { solid: string; outline: string };
} = {
	recent: {
		solid: `m618.92-298.92 42.16-42.16L510-492.16V-680h-60v212.15l168.92 168.93ZM480.07-100q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100Z`,
		outline:
			'm618.92-298.92 42.16-42.16L510-492.16V-680h-60v212.15l168.92 168.93ZM480.07-100q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100ZM480-480Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z',
	},
	'smileys-people': {
		solid: 'M616.24-527.69q21.84 0 37.03-15.29 15.19-15.28 15.19-37.11t-15.28-37.02q-15.28-15.2-37.12-15.2-21.83 0-37.02 15.29-15.19 15.28-15.19 37.11t15.28 37.02q15.28 15.2 37.11 15.2Zm-272.3 0q21.83 0 37.02-15.29 15.19-15.28 15.19-37.11t-15.28-37.02q-15.28-15.2-37.11-15.2-21.84 0-37.03 15.29-15.19 15.28-15.19 37.11t15.28 37.02q15.28 15.2 37.12 15.2ZM480-272.31q62.61 0 114.46-35.04 51.85-35.04 76.46-92.65H289.08q24.61 57.61 76.46 92.65 51.85 35.04 114.46 35.04Zm.07 172.31q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100Z',
		outline:
			'M616.24-527.69q21.84 0 37.03-15.29 15.19-15.28 15.19-37.11t-15.28-37.02q-15.28-15.2-37.12-15.2-21.83 0-37.02 15.29-15.19 15.28-15.19 37.11t15.28 37.02q15.28 15.2 37.11 15.2Zm-272.3 0q21.83 0 37.02-15.29 15.19-15.28 15.19-37.11t-15.28-37.02q-15.28-15.2-37.11-15.2-21.84 0-37.03 15.29-15.19 15.28-15.19 37.11t15.28 37.02q15.28 15.2 37.12 15.2ZM480-272.31q62.61 0 114.46-35.04 51.85-35.04 76.46-92.65H289.08q24.61 57.61 76.46 92.65 51.85 35.04 114.46 35.04Zm.07 172.31q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100ZM480-480Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z',
	},
	'animals-nature': {
		solid: 'M472.08-104.16q-158.23-24.46-252.92-127.76-94.7-103.31-108.7-273.39-1-9.07 1.93-16.23 2.92-7.15 8.15-12.38t12.38-7.66q7.16-2.42 15.62-.42 164.92 23.85 258.54 128.69 93.61 104.85 103.46 272.69 1 7.85-2.12 15-3.11 7.16-8.96 12.39-5.23 5.23-12.38 7.96-7.16 2.73-15 1.11ZM480-413.84q-15.54-26.62-57.19-66.04T346.92-536q4.93-53.84 34.54-129.57 29.62-75.73 71.93-135.81 5.23-6.85 12.19-10.27 6.96-3.42 14.42-3.42t14.31 3.42q6.84 3.42 11.69 10.88 42.31 60.7 72.54 135.89 30.23 75.19 34.54 129.65-36.31 18-77.58 57.54-41.27 39.54-55.5 63.85Zm91.07 289.53q-2-54.84-15.61-119.65-13.62-64.81-40.54-112.35 37.62-69.46 117.89-120.92 80.26-51.46 179.65-64.77 8.46-2 15.31.73 6.84 2.73 12.07 7.96t8.16 12.08q2.92 6.85 1.92 15.31-9.92 149.84-85 244.77-75.08 94.92-193.85 136.84Z',
		outline:
			'M454.92-105.77Q390.69-118 328.54-147.5q-62.15-29.5-110.96-82.08-48.81-52.57-78.96-129.84-30.16-77.27-30.16-184.42v-7.24q0-12.46 7.85-20.3 7.85-7.85 20.31-7.85h6.46q46.38 0 102.11 16.46t99.27 44q7.93-70.54 37.08-146.04 29.15-75.49 72.08-135.8Q464.08-815.3 480-815.3q15.92 0 26.38 14.69 42.93 60.31 72.08 136.19T615.54-518q42.38-26.38 97.34-43.23 54.96-16.85 103.27-18l5.54-.38q12.69-.39 21.65 8.57 8.97 8.96 8.58 21.66l-.38 6.3q-2.7 97.16-28.81 170.77-26.12 73.62-70.31 126.58-44.19 52.96-104.04 86.5-59.84 33.54-130.23 51.54-13 3.15-31.61 3.53-18.62.39-31.62-1.61ZM485.69-162q-11-165-99.5-250.5T169.69-518q-2 0 0 0 11 169 102.5 254t213.5 102q2 1 0 .5t0-.5ZM402-482q21.15 17.77 42.58 43.19Q466-413.38 480-389.84q14.23-23.54 35.54-48.97Q536.85-464.23 558-482q-1.23-58.92-21.73-123.61-20.5-64.7-56.27-124.85v.5-.5q-35.77 60.15-56.27 124.65T402-482Zm110.46 157.69q12 32 20.12 67.31 8.11 35.31 13.11 79.31 41-13.93 82.54-39.27 41.54-25.35 75.35-65.92 33.8-40.58 57.65-98.31 23.85-57.73 29.08-136.81 0-2 0 0-95.54 14-168.85 65.38-73.31 51.39-109 128.31Z',
	},
	'food-drink': {
		solid: 'M172.31-140q-29.83 0-51.07-21.24Q100-182.48 100-212.31v-115.38h760v115.38q0 29.83-21.24 51.07Q817.52-140 787.69-140H172.31ZM480-437.69q-35.62 0-55.65 20-20.04 20-71.43 20-51.38 0-70.8-20-19.43-20-55.04-20-35.62 0-55.66 20-20.03 20-71.42 20v-60q35.62 0 55.66-20 20.03-20 71.42-20 51.38 0 70.81 20 19.42 20 55.03 20 35.62 0 55.66-20t71.42-20q51.38 0 71.42 20t55.66 20q35.61 0 54.65-20t70.42-20q51.39 0 73.04 20 21.65 20 54.81 20v60q-51.39 0-69.81-20t-54.04-20q-35.61 0-56.65 20t-72.42 20q-51.39 0-71.43-20-20.03-20-55.65-20Zm-380-130V-600q0-104.61 96-162.31Q292-820 480-820t284 57.69q96 57.7 96 162.31v32.31H100Z',
		outline:
			'M172.31-140q-29.92 0-51.12-21.19Q100-182.39 100-212.31v-115.38h760v115.38q0 29.92-21.19 51.12Q817.61-140 787.69-140H172.31ZM160-267.69v55.38q0 5.39 3.46 8.85t8.85 3.46h615.38q5.39 0 8.85-3.46t3.46-8.85v-55.38H160Zm320-170q-35.62 0-55.65 20-20.04 20-71.43 20-51.38 0-70.8-20-19.43-20-55.04-20-35.62 0-55.66 20-20.03 20-71.42 20v-60q35.62 0 55.66-20 20.03-20 71.42-20 51.38 0 70.81 20 19.42 20 55.03 20 35.62 0 55.66-20t71.42-20q51.38 0 71.42 20t55.66 20q35.61 0 54.65-20t70.42-20q51.39 0 73.04 20 21.65 20 54.81 20v60q-51.39 0-69.81-20t-54.04-20q-35.61 0-56.65 20t-72.42 20q-51.39 0-71.43-20-20.03-20-55.65-20Zm-380-130V-600q0-104.61 96-162.31Q292-820 480-820t284 57.69q96 57.7 96 162.31v32.31H100ZM480-760q-140.16 0-221.15 34.65-81 34.66-95.16 97.66h632.62q-14.16-63-95.16-97.66Q620.16-760 480-760Zm0 492.31Zm0-360Z',
	},
	'travel-places': {
		solid: 'M224.61-220v50q0 12.75-8.62 21.37-8.63 8.63-21.38 8.63H170q-12.75 0-21.37-8.63Q140-157.25 140-170v-306.92L221.69-710q4.47-13.77 16.39-21.88Q250-740 264.62-740h432.3q14.04 0 25.5 8.25 11.45 8.25 15.89 21.75L820-476.92V-170q0 12.75-8.63 21.37Q802.75-140 790-140h-24.61q-12.75 0-21.38-8.63-8.62-8.62-8.62-21.37v-50H224.61Zm-.3-316.92h511.38L685.23-680H274.77l-50.46 143.08Zm74.24 210.77q21.83 0 37.03-15.29 15.19-15.28 15.19-37.11t-15.28-37.03q-15.29-15.19-37.12-15.19t-37.02 15.28q-15.2 15.29-15.2 37.12t15.29 37.02q15.28 15.2 37.11 15.2Zm363.08 0q21.83 0 37.02-15.29 15.2-15.28 15.2-37.11t-15.29-37.03q-15.28-15.19-37.11-15.19t-37.03 15.28q-15.19 15.29-15.19 37.12t15.28 37.02q15.29 15.2 37.12 15.2Z',
		outline:
			'M224.61-220v50q0 12.75-8.62 21.37-8.63 8.63-21.38 8.63H170q-12.75 0-21.37-8.63Q140-157.25 140-170v-306.92L221.69-710q4.47-13.77 16.39-21.88Q250-740 264.62-740h432.3q14.04 0 25.5 8.25 11.45 8.25 15.89 21.75L820-476.92V-170q0 12.75-8.63 21.37Q802.75-140 790-140h-24.61q-12.75 0-21.38-8.63-8.62-8.62-8.62-21.37v-50H224.61Zm-.3-316.92h511.38L685.23-680H274.77l-50.46 143.08Zm-24.31 60V-280v-196.92Zm98.55 150.77q21.83 0 37.03-15.29 15.19-15.28 15.19-37.11t-15.28-37.03q-15.29-15.19-37.12-15.19t-37.02 15.28q-15.2 15.29-15.2 37.12t15.29 37.02q15.28 15.2 37.11 15.2Zm363.08 0q21.83 0 37.02-15.29 15.2-15.28 15.2-37.11t-15.29-37.03q-15.28-15.19-37.11-15.19t-37.03 15.28q-15.19 15.29-15.19 37.12t15.28 37.02q15.29 15.2 37.12 15.2ZM200-280h560v-196.92H200V-280Z',
	},
	objects: {
		solid: 'M480-122.31q-24.08 0-42.58-12.69-18.5-12.7-25.88-33.31H400q-24.54 0-42.27-17.73Q340-203.77 340-228.31v-131.23q-60.54-36.69-95.27-98.38Q210-519.62 210-590q0-112.92 78.54-191.46T480-860q112.92 0 191.46 78.54T750-590q0 71.61-34.73 132.69T620-359.54v131.23q0 24.54-17.73 42.27-17.73 17.73-42.27 17.73h-11.54q-7.38 20.61-25.88 33.31-18.5 12.69-42.58 12.69Zm-80-106h160v-37.54H400v37.54Zm0-72.92h160V-340H400v38.77ZM503.85-400v-116.46l85.69-85.69L556-635.69l-76 76-76-76-33.54 33.54 85.69 85.69V-400h47.7Z',
		outline:
			'M480-122.31q-24.08 0-42.58-12.69-18.5-12.7-25.88-33.31H400q-24.54 0-42.27-17.73Q340-203.77 340-228.31v-131.23q-60.54-36.69-95.27-98.38Q210-519.62 210-590q0-112.92 78.54-191.46T480-860q112.92 0 191.46 78.54T750-590q0 71.61-34.73 132.69T620-359.54v131.23q0 24.54-17.73 42.27-17.73 17.73-42.27 17.73h-11.54q-7.38 20.61-25.88 33.31-18.5 12.69-42.58 12.69Zm-80-106h160v-37.54H400v37.54Zm0-72.92h160V-340H400v38.77ZM392-400h64.15v-116.46l-85.69-85.69L404-635.69l76 76 76-76 33.54 33.54-85.69 85.69V-400H568q54-26 88-76.5T690-590q0-88-61-149t-149-61q-88 0-149 61t-61 149q0 63 34 113.5t88 76.5Zm88-159.69Zm0-40.31Z',
	},
	activities: {
		solid: 'M101.62-510.61q3.84-52.93 20.61-100.16t46.31-88q36.15 37.16 59.85 86.58 23.69 49.42 29.15 101.58H101.62Zm600.84 0q5.46-52.16 28.08-100.5 22.61-48.35 60.92-85.89 29.54 40.15 46.31 87.5 16.77 47.35 20.61 98.89H702.46ZM168.54-263q-29.54-40.15-45.92-86.81-16.39-46.65-21-99.58h155.92q-5.46 52.16-29.15 100.5-23.7 48.35-59.85 85.89Zm622.92 0q-38.31-37.54-60.92-85.89-22.62-48.34-28.08-100.5h155.92q-3.84 51.54-20.61 98.89T791.46-263ZM318.54-510.61q-6.08-68.16-35.15-126.85-29.08-58.69-77.16-106.15 47.23-49.16 109.5-78.93 62.27-29.77 133.66-35.84v347.77H318.54Zm192.07 0v-347.77q71.39 6.07 133.66 35.84 62.27 29.77 109.5 78.93-49.08 45.69-77.66 105.27-28.57 59.57-34.65 127.73H510.61Zm-61.22 408.99q-72.77-6.07-134.35-36.54-61.58-30.46-108.81-79.61 49.08-46.08 77.66-104.58 28.57-58.5 34.65-127.04h130.85v347.77Zm61.22 0v-347.77h130.85q6.08 68.54 34.65 127.93 28.58 59.38 77.66 105.07-47.23 49.16-109.5 78.93-62.27 29.77-133.66 35.84Z',
		outline:
			'M161.23-510h126.31q-4.85-42.61-23.77-81.19t-48.38-68.04q-22.24 32.46-36.27 69.96-14.04 37.5-17.89 79.27Zm511.23 0h126.31q-3.85-41.38-17.89-78.69-14.03-37.31-36.27-69.77-30.61 29.84-48.96 67.84-18.34 38.01-23.19 80.62ZM215.39-301.54q29.46-29.84 48.38-67.84 18.92-38.01 23.77-80.62H161.23q4.23 41.77 18.08 78.88 13.84 37.12 36.08 69.58Zm529.22 0q22.24-32.46 36.27-69.77 14.04-37.31 17.89-78.69H672.46q4.85 42.61 23.19 80.62 18.35 38 48.96 67.84ZM348.77-510H450v-288.77q-58 6.08-108.31 30.08t-88.61 63.61q39.77 39.16 64.69 88.62 24.92 49.46 31 106.46ZM510-510h101.23q6.08-57 30.81-106.85 24.73-49.84 64.88-88.23-38.3-39.61-88.61-63.61T510-798.77V-510Zm-60 348.77V-450H348.77q-6.08 57.77-30.81 106.85-24.73 49.07-64.88 87.46 38.3 39.61 88.23 64 49.92 24.38 108.69 30.46Zm60 0q58-6.08 108.31-30.08t88.61-63.61q-40.15-38.39-64.88-87.85-24.73-49.46-30.81-107.23H510v288.77ZM480-480Zm0 380q-78.77 0-148.11-29.96-69.35-29.96-120.66-81.27-51.31-51.31-81.27-120.66Q100-401.23 100-480q0-78.77 29.96-148.11 29.96-69.35 81.27-120.66 51.31-51.31 120.66-81.27Q401.23-860 480-860q78.77 0 148.11 29.96 69.35 29.96 120.66 81.27 51.31 51.31 81.27 120.66Q860-558.77 860-480q0 78.77-29.96 148.11-29.96 69.35-81.27 120.66-51.31 51.31-120.66 81.27Q558.77-100 480-100Z',
	},
	symbols: {
		solid: 'm95.39-531.54 185.38-328.84 185.38 328.84H95.39Zm185.76 401.92q-62.53 0-106.46-43.92-43.92-43.92-43.92-106.46 0-62.15 43.92-106.27 43.93-44.11 106.46-44.11 62.16 0 106.27 44.11 44.12 44.12 44.12 106.27 0 62.54-44.12 106.46-44.11 43.92-106.27 43.92Zm249.24 0v-300.76h300.76v300.76H530.39Zm150.38-401.92q-47-38.77-81.65-67.92-34.66-29.15-57.27-53.58-22.62-24.42-33.77-47.19-11.16-22.77-11.16-48.15 0-40.39 27.47-67.54 27.46-27.16 69.07-27.16 25.46 0 47.62 12.12 22.15 12.12 39.69 34.88 17.54-22.38 40.08-34.69 22.53-12.31 47.61-12.31 41.23 0 68.69 27.73 27.46 27.74 27.46 68.12 0 25-11.15 47.58-11.15 22.57-33.77 46.8-22.61 24.24-57.27 53.39-34.65 29.15-81.65 67.92Z',
		outline:
			'm95.39-531.54 185.38-328.84 185.38 328.84H95.39Zm185.76 401.92q-62.53 0-106.46-43.92-43.92-43.92-43.92-106.3 0-63.31 43.92-106.93 43.93-43.61 106.46-43.61 62.54 0 106.46 43.92 43.93 43.92 43.93 106.46 0 62.54-43.93 106.46-43.92 43.92-106.46 43.92Zm0-59.99q37.62 0 64-26.39 26.39-26.38 26.39-64 0-37.62-26.39-64-26.38-26.39-64-26.39-37.61 0-64 26.39-26.38 26.38-26.38 64 0 37.62 26.38 64 26.39 26.39 64 26.39Zm-83.23-401.93H364l-83.23-145.77-82.85 145.77Zm332.47 461.92v-300.76h300.76v300.76H530.39Zm59.99-59.99h180.77v-180.78H590.38v180.78Zm90.39-341.93q-47-38.77-81.65-67.92-34.66-29.15-57.27-53.58-22.62-24.42-33.77-47.19-11.16-22.77-11.16-48.15 0-40.39 27.47-67.54 27.46-27.16 69.07-27.16 25.46 0 47.61 12.12 22.16 12.12 39.7 34.88 17.54-22.38 40.08-34.69 22.53-12.31 47.61-12.31 41.08 0 68.62 27.77 27.53 27.77 27.53 68.08 0 25-11.15 47.58-11.15 22.57-33.77 46.8-22.61 24.24-57.27 53.39-34.65 29.15-81.65 67.92Zm0-78.46q70.85-56.92 97.35-86.15 26.5-29.23 26.5-50.23 0-16.08-9.81-26.39-9.81-10.31-25.5-10.31-11.46 0-22.35 6.66-10.88 6.65-28.73 24.5l-37.46 36.23-37.46-36.23q-18.23-18.23-28.89-24.7-10.65-6.46-22.19-6.46-16.08 0-25.69 9.73-9.62 9.73-9.62 26.2 0 21.77 26.5 51T680.77-610Zm0-86.85Zm-399.62 31.93Zm0 384.92Zm399.62 0Z',
	},
	flags: {
		solid: 'M220-130v-650h323.84l16 80H780v360H536.16l-16-80H280v290h-60Z',
		outline:
			'M220-130v-650h323.84l16 80H780v360H536.16l-16-80H280v290h-60Zm280-430Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z',
	},
};
