export interface StoryEntry {
  speaker: string;
  text: string;
  action: '' | 'arrive' | 'extinguish' | 'light';
}

export const storyScript: StoryEntry[] = [
  {
    speaker: '내레이션',
    text: '어린왕자가 여섯 번째 행성에 도착했습니다.\n그 행성에는 가로등 하나와 가로등을 켜는 아저씨가 살고 있었습니다.',
    action: 'arrive',
  },
  {
    speaker: '가로등지기',
    text: '"안녕..." (가로등을 끕니다)',
    action: 'extinguish',
  },
  {
    speaker: '어린왕자',
    text: '"안녕하세요! 왜 가로등을 껐다 켰다 하는 거예요?"',
    action: '',
  },
  {
    speaker: '가로등지기',
    text: '"명령이야. 안녕." (또 가로등을 켭니다)',
    action: 'light',
  },
  {
    speaker: '어린왕자',
    text: '"무슨 명령이에요?"',
    action: '',
  },
  {
    speaker: '가로등지기',
    text: '"가로등을 끄는 명령. 잘 자. 안녕." (또 끕니다)\n\n예전엔 하루에 한 번만 켜고 껐는데... 그때부터 행성이 빨리 돌기 시작했지.',
    action: 'extinguish',
  },
  {
    speaker: '가로등지기',
    text: '"이제는 1분에 한 번씩 켰다 껐다 해야 해. 쉴 틈이 없어."',
    action: 'light',
  },
  {
    speaker: '어린왕자',
    text: '"그럼 쉬고 싶을 때는 어떻게 해요?"',
    action: '',
  },
  {
    speaker: '가로등지기',
    text: '"쉬고 싶으면 걸으면 되지. 그런데 그게 무슨 소용이야..." (또 끕니다)',
    action: 'extinguish',
  },
  {
    speaker: '내레이션',
    text: '어린왕자는 생각했습니다.\n\n"이 사람은 어리석지 않아. 일이 있고, 명령에 충실하니까.\n저 사람이 다른 행성 사람들에게 업신여김 받는 게 아깝다."',
    action: '',
  },
  {
    speaker: '어린왕자',
    text: '"아저씨... 저는 이제 떠나야 해요. 안녕히 계세요."',
    action: '',
  },
  {
    speaker: '가로등지기',
    text: '"잘 가." (가로등을 켭니다)\n\n"저 아이와 함께라면 우리는 친구가 될 수 있었을 텐데..."',
    action: 'light',
  },
];
