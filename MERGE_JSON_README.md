# JSON词汇文件合并工具

此工具用于将JSON格式的词汇数据合并到目标词汇文件中。

## 功能特性

- 根据[word](file://E:\GolandProjects\english-learning\vocabulary_sample.json#L2C11-L2C16)字段匹配词汇条目
- 当词汇存在时，只合并源数据中有值的字段，不覆盖原有数据
- 当词汇不存在时，新增整个条目
- 保持目标文件的JSON格式

## 使用方法

### 命令行使用

```bash
node merge_json.js '[源JSON数组字符串]' <目标文件路径>
```

示例：
```bash
node merge_json.js '[{"word":"hello","meaning":["你好"]}]' ./seventh_grade_vocabulary.json
```

### 在代码中使用

```javascript
const { mergeVocabularyFiles } = require('./merge_json.js');

const sourceJson = '[{"word":"hello","meaning":["你好"]}]';
const targetFile = './seventh_grade_vocabulary.json';

mergeVocabularyFiles(sourceJson, targetFile);
```

## 合并规则

1. 如果目标文件中存在相同[word](file://E:\GolandProjects\english-learning\vocabulary_sample.json#L2C11-L2C16)的条目，则：
   - 更新源数据中提供的所有字段
   - 保留目标文件中源数据未提供的字段
2. 如果目标文件中不存在相同[word](file://E:\GolandProjects\english-learning\vocabulary_sample.json#L2C11-L2C16)的条目，则：
   - 新增整个条目

## 注意事项

- 源JSON必须是数组格式
- 字段值为null、undefined或空字符串时不会覆盖原有值
- 保留原有字段的完整性