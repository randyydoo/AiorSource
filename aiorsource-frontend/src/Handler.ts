export interface Data {
  sourceText: string[]
  aiText: string[]
}

export class Handler {
  private readonly api: string


  constructor() {
    this.api = "https://ffyc727gc7.execute-api.us-west-1.amazonaws.com/prod/test"
    // this.getRandomizedSourceText()
  }

  getRandom(): boolean {
    const random: number = Math.floor(Math.random() * (3 - 1) + 1);
    return random % 2 == 1
  }

  getRandomizedText(source_texts: string[], ai_texts: string[]): Data {
    const indexes: number[] = new Array() // [0 - data_length-1]
    const randomized_indexes: number[] = new Array()
    const randomized_ai_text: string[] = new Array()
    const randomized_source_text: string[] = new Array()

    
    //  create index stack from 0-length of data-1
    for (let i = 0; i < source_texts.length; i++) {
      indexes.push(i)
    }
    // 1. get Random index from index stack
    while (indexes.length > 0) {
      const randIdx: number = Math.floor(Math.random() * (indexes.length - 0) + 0)
      // 2. swap with top of stack
      const topStackNum: number = indexes[indexes.length - 1]
      const randomNum: number = indexes[randIdx]
      indexes[indexes.length - 1] = randomNum
      indexes[randIdx] = topStackNum
      // 3. pop from top of stack
      randomized_indexes.push(indexes.pop()!)
    }
    while (randomized_indexes.length > 0) {
      const i: number = randomized_indexes.pop()!
      const source_text: string = source_texts[i]
      const ai_text: string = ai_texts[i]
      randomized_source_text.push(source_text)
      randomized_ai_text.push(ai_text)
    }
    return {sourceText: randomized_source_text, aiText: randomized_ai_text}
  }

  isValid(event: MouseEvent, sourceTextButton1: boolean): boolean {
    const target = event.target as HTMLButtonElement;
    if ((sourceTextButton1 && target.id == "btn1") || (!sourceTextButton1 && target.id == "btn2")) {
      return true
    }
    return false;
  }

  async generate_ai_text(topic: string): Promise<Data> {
    try {
      const response = await fetch(this.api, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: Data = await response.json();
      return result
    }
    catch (e: any) {
      throw(e);
    }
  }
}