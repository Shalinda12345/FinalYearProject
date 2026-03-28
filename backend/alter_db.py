# import pymysql

# conn = pymysql.connect(host='localhost', port=3308, user='root', password='', db='auth_db')
# cur = conn.cursor()
# try:
#     cur.execute("ALTER TABLE orders ADD COLUMN delivery_date VARCHAR(50) NULL;")
#     conn.commit()
#     print("Column added successfully!")
# except Exception as e:
#     print("Error:", e)
# finally:
#     conn.close()
