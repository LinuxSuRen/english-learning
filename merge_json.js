const fs = require('fs');
const path = require('path');

/**
 * 合并JSON词汇文件
 * @param {string} sourceJson - 源JSON字符串（数组格式）
 * @param {string} targetFile - 目标JSON文件路径
 */
function mergeVocabularyFiles(sourceJson, targetFile) {
  try {
    // 解析源JSON字符串和读取目标文件
    const sourceData = JSON.parse(sourceJson);
    const targetData = JSON.parse(fs.readFileSync(targetFile, 'utf8'));

    // 创建目标文件中词汇的映射，用于快速查找
    const targetWordMap = {};
    targetData.forEach((item, index) => {
      targetWordMap[item.word] = { index, item };
    });

    // 遍历源数据中的词汇
    sourceData.forEach(sourceItem => {
      const word = sourceItem.word;

      if (targetWordMap.hasOwnProperty(word)) {
        // 如果词汇已存在，只合并源数据中有值的字段
        console.log(`更新词汇: ${word}`);
        const targetIndex = targetWordMap[word].index;
        const existingItem = targetData[targetIndex];
        
        // 遍历源数据中的所有字段，只更新有值的字段
        for (const key in sourceItem) {
          if (sourceItem.hasOwnProperty(key)) {
            // 如果源数据中的字段值不为null、undefined或空数组/空字符串，则更新
            if (sourceItem[key] !== null && sourceItem[key] !== undefined) {
              if (Array.isArray(sourceItem[key]) && sourceItem[key].length === 0) {
                // 对于空数组，可以选择是否更新，这里我们保留原值
                continue;
              } else if (typeof sourceItem[key] === 'string' && sourceItem[key].trim() === '') {
                // 对于空字符串，保留原值
                continue;
              } else {
                // 对于非空值，更新字段
                existingItem[key] = sourceItem[key];
              }
            }
          }
        }
        
        // 更新目标数组中的条目
        targetData[targetIndex] = existingItem;
      } else {
        // 如果词汇不存在，新增条目
        console.log(`新增词汇: ${word}`);
        targetData.push(sourceItem);
      }
    });

    // 将合并后的数据写回目标文件
    fs.writeFileSync(targetFile, JSON.stringify(targetData, null, 2), 'utf8');
    console.log(`成功合并JSON数据到文件: ${targetFile}`);
  } catch (error) {
    console.error('合并JSON文件时出错:', error.message);
  }
}

/**
 * 命令行接口
 */
function main() {
  if (process.argv.length !== 4) {
    console.log('使用方法: node merge_json.js \'[源JSON数组字符串]\' <目标文件路径>');
    console.log('示例: node merge_json.js \'[{"word":"test","meaning":["测试"]}]\' ./target.json');
    return;
  }

  const sourceJson = process.argv[2];
  const targetFile = process.argv[3];

  // 验证目标文件是否存在
  if (!fs.existsSync(targetFile)) {
    console.error(`错误: 目标文件不存在 - ${targetFile}`);
    return;
  }

  mergeVocabularyFiles(sourceJson, targetFile);
}

// 如果直接运行此文件，则执行主函数
if (require.main === module) {
  main();
}

module.exports = { mergeVocabularyFiles };