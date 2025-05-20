import React, { useState, useEffect, RefObject, useImperativeHandle } from 'react';
import { Form, Input, message, Modal, Select, Button, Space } from 'antd';
import ReactMarkdown from 'react-markdown';
import styles from './ArticleManagement.module.css';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import { TagsAPI } from '@/api/TagsAPI';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  htmlContent: string;
  excerpt: string;
  coverImage: string;
  images: string[];
  authorId: number;
  status: string;
  postType: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  readingTime: number;
  tags?: Tag[];
}

interface Tag {
  id: number;
  name: string;
}

interface IProps {
  mref: RefObject<{ openModal: (type: string, data?: Article) => void }>;
  update: () => void;
}

const ArticleManagement: React.FC<IProps> = (props) => {
  const [form] = Form.useForm();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState<string>('create');
  const [error, setError] = useState<string>('');
  const [allTags, setAllTags] = useState<Tag[]>([]);

  useImperativeHandle(props.mref, () => ({ openModal }));

  useEffect(() => {
    fetchArticles();
    fetchTags();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await ArticlesAPI.getArticles();
      setArticles(response.data);
    } catch (error) {
      setError('获取文章列表失败');
    }
  };

  const fetchTags = async () => {
    try {
      const response = await TagsAPI.getTags();
      setAllTags(response);
    } catch (error) {
      setError('获取标签列表失败');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const openModal = (type: string, data?: Article) => {
    setIsModalOpen(true);
    setAction(type);
    if (data) {
      form.setFieldsValue({
        ...data,
        tags: data.tags?.map(tag => tag.id)
      });
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        htmlContent: values.content,
        slug: values.title?.toLowerCase().replace(/\s+/g, '-'),
        authorId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: values.status === 'published' ? new Date().toISOString() : null,
        viewCount: 0,
        likeCount: 0,
        readingTime: Math.ceil((values.content?.length || 0) / 500)
      };

      if (action === 'create') {
        await ArticlesAPI.createArticle(data);
        message.success('创建文章成功');
      } else if (action === 'edit') {
        await ArticlesAPI.updateArticle(values.id, data);
        message.success('更新文章成功');
      }

      setIsModalOpen(false);
      form.resetFields();
      props.update();
    } catch (error: any) {
      message.error(`操作失败：${error.message}`);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    try {
      await ArticlesAPI.deleteArticle(id);
      message.success('删除文章成功');
      props.update();
    } catch (error: any) {
      message.error(`删除失败：${error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>文章管理</h2>
        <Button type="primary" onClick={() => openModal('create')}>
          添加文章
        </Button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <Modal
        title={action === 'create' ? '创建文章' : '编辑文章'}
        open={isModalOpen}
        width={800}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} labelAlign="right" labelCol={{ span: 4 }}>
          <Form.Item hidden name="id">
            <Input />
          </Form.Item>

          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" />
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <Input.TextArea
              rows={10}
              placeholder="支持 Markdown 格式"
              className={styles.markdownEditor}
            />
          </Form.Item>

          <Form.Item label="摘要" name="excerpt">
            <Input.TextArea rows={3} placeholder="请输入文章摘要" />
          </Form.Item>

          <Form.Item label="封面图片" name="coverImage">
            <Input placeholder="请输入封面图片URL" />
          </Form.Item>

          <Form.Item label="状态" name="status" initialValue="draft">
            <Select>
              <Select.Option value="draft">草稿</Select.Option>
              <Select.Option value="published">已发布</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="文章类型" name="postType" initialValue="post">
            <Select>
              <Select.Option value="post">文章</Select.Option>
              <Select.Option value="page">笔记</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="标签" name="tags">
            <Select mode="multiple" placeholder="请选择标签">
              {allTags.map(tag => (
                <Select.Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <div className={styles.articleList}>
        {articles.map(article => (
          <div key={article.id} className={styles.articleItem}>
            <div className={styles.articleHeader}>
              <h3>{article.title}</h3>
              <div className={styles.articleMeta}>
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                <span>阅读时长：{article.readingTime}分钟</span>
              </div>
            </div>
            <div className={styles.articleContent}>
              <p>{article.excerpt}</p>
            </div>
            <div className={styles.articleFooter}>
              <Space>
                <Button type="primary" onClick={() => openModal('edit', article)}>
                  编辑
                </Button>
                <Button danger onClick={() => handleDeleteArticle(article.id)}>
                  删除
                </Button>
              </Space>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleManagement; 