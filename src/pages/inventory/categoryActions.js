export function buildCategoryForm(category = {}) {
  return {
    id: Number(category.id) || 0,
    name: category.name || '',
    sort: Number(category.sort) || 0,
  }
}

export function buildSubCategoryForm(categoryId = 0, subCategory = {}) {
  return {
    id: Number(subCategory.id) || 0,
    categoryId: Number(subCategory.categoryId || categoryId) || 0,
    name: subCategory.name || '',
    sort: Number(subCategory.sort) || 0,
  }
}

export function buildCategoryPayload(openid, form) {
  return {
    openid,
    name: (form.name || '').trim(),
    sort: Number(form.sort) || 0,
  }
}

export function buildSubCategoryPayload(openid, form) {
  return {
    openid,
    categoryId: Number(form.categoryId) || 0,
    name: (form.name || '').trim(),
    sort: Number(form.sort) || 0,
  }
}

export function getCategoryDialogTitle(form) {
  return form?.id ? '编辑大分类' : '新增大分类'
}

export function getSubCategoryDialogTitle(form) {
  return form?.id ? '编辑小分类' : '新增小分类'
}

export function getCategoryActionItems() {
  return [
    { key: 'edit', icon: 'edit', label: '编辑大分类', tone: 'default' },
    { key: 'delete', icon: 'delete-o', label: '删除大分类', tone: 'danger' },
    { key: 'subCategory', icon: 'add-o', label: '新增小分类', tone: 'primary' },
  ]
}

export function getSubCategoryActionItems() {
  return [
    { key: 'edit', icon: 'edit', label: '编辑小分类', tone: 'default' },
    { key: 'delete', icon: 'delete-o', label: '删除小分类', tone: 'danger' },
    { key: 'item', icon: 'add-o', label: '新增物品', tone: 'primary' },
  ]
}

export function buildInventoryOpenidUrl(url, openid) {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}openid=${encodeURIComponent(openid)}`
}

export function translateInventoryError(message) {
  const messages = {
    'category already exists': '大分类已存在',
    'category has subcategories': '该大分类下还有小分类，不能删除',
    'subcategory already exists': '小分类已存在',
    'subcategory has items': '该小分类下还有物品，不能删除',
    'record not found': '数据不存在',
  }
  return messages[message] || message
}
